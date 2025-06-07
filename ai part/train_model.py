"""import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder

df = pd.read_csv('training_dataset.csv')

le = LabelEncoder()
df['industry'] = le.fit_transform(df['industry'])

X = df.drop(columns=['label', 'mission_id', 'freelancer_id'])
y = df['label'].astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

example = X.iloc[0:1]
prediction = model.predict(example)
print("Prediction for first row:", prediction[0])
"""
#2
"""
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder

df = pd.read_csv('training_dataset.csv')

le = LabelEncoder()
df['industry'] = le.fit_transform(df['industry'])

X = df.drop(columns=['label', 'mission_id', 'freelancer_id'])
y = df['label'].astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

example = X.iloc[0:1]
probabilities = model.predict_proba(example)
selected_prob = probabilities[0][1]
print("Probability freelancer will be selected for first row:", selected_prob)
"""
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import pandas as pd
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder

app = FastAPI()

class MissionFeatures(BaseModel):
    skill_match_score: float
    has_worked_with_client_before: int
    was_preselected: int
    price: float
    industry: str
    times_worked_with_client: int

class PredictionRequest(BaseModel):
    data: List[MissionFeatures]

def train_model():
    df = pd.read_csv('training_dataset.csv')
    known_industries = df['industry'].unique().tolist()
    df['industry'] = df['industry'].apply(lambda x: x if x in known_industries else 'Other')
    le = LabelEncoder()
    df['industry'] = le.fit_transform(df['industry'])
    X = df.drop(columns=['label', 'mission_id', 'freelancer_id'])
    y = df['label'].astype(int)
    model = LogisticRegression(max_iter=1000)
    model.fit(X, y)
    joblib.dump(le, 'industry_encoder.pkl')
    joblib.dump(model, 'logistic_model.pkl')
    joblib.dump(X.columns.tolist(), 'feature_columns.pkl')
    return model, le, X.columns.tolist()

model, industry_encoder, feature_columns = train_model()

@app.post("/predict")
def predict(request: PredictionRequest):
    df = pd.DataFrame([f.model_dump() for f in request.data])
    known_labels = industry_encoder.classes_.tolist()
    df['industry'] = df['industry'].apply(lambda x: x if x in known_labels else 'Other')
    df['industry'] = industry_encoder.transform(df['industry'])
    X = df[feature_columns]
    probs = model.predict_proba(X)[:, 1]
    return [{"prob_1": float(prob)} for prob in probs]
