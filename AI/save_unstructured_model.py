# save_unstructured_model.py
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputClassifier
from xgboost import XGBClassifier

# Load unstructured dataset
df = pd.read_csv("unstructured_patient_dataset.csv")

# Feature
X = df["Symptoms"].astype(str).str.lower().values
tfidf = TfidfVectorizer(max_features=3000, stop_words='english')
X_vec = tfidf.fit_transform(X)

# Targets
le_severity = LabelEncoder()
ohe_doctor = OneHotEncoder(sparse_output=False)

y_severity = le_severity.fit_transform(df["severity"])
y_doctor = ohe_doctor.fit_transform(df["suggested_doctor"].values.reshape(-1, 1))

Y = np.hstack((y_severity.reshape(-1, 1), y_doctor))

# Split
X_train, X_test, Y_train, Y_test = train_test_split(X_vec, Y, test_size=0.1, random_state=42)

# Train model
model = MultiOutputClassifier(XGBClassifier(use_label_encoder=False, eval_metric='mlogloss'))
model.fit(X_train, Y_train)

# Save
joblib.dump(model, "unstructured_model.pkl")
joblib.dump(tfidf, "unstructured_vectorizer.pkl")
joblib.dump(le_severity, "unstructured_severity_encoder.pkl")
joblib.dump(ohe_doctor, "unstructured_doctor_encoder.pkl")

print("✅ Unstructured model & components saved.")
