from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import joblib
import numpy as np

app = FastAPI()


class PredictRequest(BaseModel):
    input_text: str
    mode: str


structured_model = joblib.load("structured_model.pkl")
structured_vectorizer = joblib.load("structured_vectorizer.pkl")
structured_le_severity = joblib.load("structured_severity_encoder.pkl")
structured_ohe = joblib.load("structured_doctor_encoder.pkl")

unstructured_model = joblib.load("unstructured_model.pkl")
unstructured_vectorizer = joblib.load("unstructured_vectorizer.pkl")
unstructured_le_severity = joblib.load("unstructured_severity_encoder.pkl")
unstructured_ohe = joblib.load("unstructured_doctor_encoder.pkl")


@app.post("/predict")
def predict(payload: PredictRequest):
    print("🔥 Received:", payload.input_text, payload.mode)
    input_text = payload.input_text
    mode = payload.mode

    if mode == "structured":
        X = structured_vectorizer.transform([input_text.lower()])
        pred = structured_model.predict(X)
        severity = structured_le_severity.inverse_transform([int(pred[0][0])])[0]
        doctor = "Unknown"
        if not np.all(pred[0][1:] == 0):
            doctor = structured_ohe.inverse_transform([pred[0][1:]])[0][0]
    else:
        X = unstructured_vectorizer.transform([input_text.lower()])
        pred = unstructured_model.predict(X)
        severity = unstructured_le_severity.inverse_transform([int(pred[0][0])])[0]
        doctor = "Unknown"
        if not np.all(pred[0][1:] == 0):
            doctor = unstructured_ohe.inverse_transform([pred[0][1:]])[0][0]

    return {
        "input_text": input_text,
        "mode": mode,
        "result": {
            "severity": severity,
            "suggested_doctor": doctor
        }
    }
