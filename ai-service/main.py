from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class DecisionRequest(BaseModel):
    decision: str
    context: str

@app.get("/health")
def health_check():
    return {"status": "AI Service is running"}

@app.post("/simulate")
def simulate_decision(req: DecisionRequest):
    # TODO: Implement AI generation for best/worst case scenarios
    return {
        "best_case": f"If you choose to {req.decision}, you might achieve great success.",
        "worst_case": f"If you choose to {req.decision}, there could be unexpected challenges."
    }
