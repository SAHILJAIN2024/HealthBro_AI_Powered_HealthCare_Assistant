from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from nlp_pipeline import extract_soap
from db_utils import save_note_to_db
import whisper, os, uuid

app = FastAPI()

# Allow CORS from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = whisper.load_model("base")

import traceback

@app.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    email: str = Form(...)
):
    try:
        file_ext = file.filename.split(".")[-1]
        temp_filename = f"temp_{uuid.uuid4()}.{file_ext}"
        with open(temp_filename, "wb") as f:
            f.write(await file.read())

        result = model.transcribe(temp_filename)
        transcript = result["text"]
        soap_note = extract_soap(transcript)

        os.remove(temp_filename)

        note_id = save_note_to_db(email, transcript, soap_note)

        return {
            "note_id": note_id,
            "transcript": transcript,
            "soap_note": soap_note
        }

    except Exception as e:
        print("❌ Transcription error:", str(e))
        traceback.print_exc()  # This will give the full traceback in the terminal
        return JSONResponse(content={"error": str(e)}, status_code=500)
