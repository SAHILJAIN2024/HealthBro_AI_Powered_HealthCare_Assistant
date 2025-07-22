# save_structured_model.py
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputClassifier
from xgboost import XGBClassifier

# Load structured dataset
df = pd.read_csv("structured_patient_dataset.csv")

# Text to features
tfidf = TfidfVectorizer(max_features=3000, stop_words="english")
X = tfidf.fit_transform(df["Symptom Description"].astype(str))

# Encode labels
le_severity = LabelEncoder()
ohe_doctor = OneHotEncoder(sparse_output=False)

y_severity = le_severity.fit_transform(df["Severity"])
y_doctor = ohe_doctor.fit_transform(df["Suggested Doctor"].values.reshape(-1, 1))

Y = np.hstack((y_severity.reshape(-1, 1), y_doctor))

# Train/test split
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.1, random_state=42)

# Train model
model = MultiOutputClassifier(XGBClassifier(use_label_encoder=False, eval_metric='mlogloss'))
model.fit(X_train, Y_train)

# Save everything
joblib.dump(model, "structured_model.pkl")
joblib.dump(tfidf, "structured_vectorizer.pkl")
joblib.dump(le_severity, "structured_severity_encoder.pkl")
joblib.dump(ohe_doctor, "structured_doctor_encoder.pkl")

print("✅ Structured model & components saved.")
