from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb+srv://jainsahil022:vFQnGATBv3Cg6hPY@healthreport.tbnw5r0.mongodb.net/?retryWrites=true&w=majority&appName=HealthReport")
db = client["test"]
collection = db["prescription"]

def save_note_to_db(patient_id: str, transcript: str, soap_note: dict):
    note = {
        "patient_id": patient_id,
        "transcript": transcript,
        "soap_note": soap_note,
        "timestamp": datetime.utcnow()
    }
    result = collection.insert_one(note)
    return str(result.inserted_id)

def get_notes_by_patient(patient_id: str):
    return list(collection.find({"patient_id": patient_id}, {"_id": 0}))
