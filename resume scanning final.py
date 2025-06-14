import fitz  # PyMuPDF
import pandas as pd
import torch
from transformers import BertTokenizer, BertModel
from torch.nn import functional as F

# Load BERT
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
model = BertModel.from_pretrained("bert-base-uncased")

# Extract text from resume PDF
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()

# Get BERT embedding
def get_bert_embedding(text):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.pooler_output[0]

# Calculate cosine similarity
def get_similarity_score(resume_text, example_text):
    vec1 = get_bert_embedding(resume_text)
    vec2 = get_bert_embedding(example_text)
    return round(F.cosine_similarity(vec1, vec2, dim=0).item() * 100, 2)

# Label based on score
def label_score(score):
    if score >= 75:
        return "Shortlist ✅"
    
    else:
        return "Reject ❌"

# Compare candidate resume with each domain
def match_resume_to_domains(resume_pdf_path, csv_path):
    resume_text = extract_text_from_pdf(resume_pdf_path)
    df = pd.read_csv(csv_path)

    # Use one sample resume per category
    sample_resumes = df.groupby("Role").first().reset_index()

    results = []
    for _, row in sample_resumes.iterrows():
        Role = row['Role']
        sample_resume = row['skill']
        score = get_similarity_score(resume_text, sample_resume)
        label = label_score(score)

        results.append({
            "Job Domain": Role,
            "Match Score": score,
            "Status": label
        })

    result_df = pd.DataFrame(results).sort_values(by="Match Score", ascending=False)
    print(result_df.head(10))  # Show top 10 matches
    return result_df

# 🧪 Example Usage:
resume_pdf_path = "C:/Users/HARINI SRI/Downloads/resume (5).pdf"  # Replace with your actual resume PDF path
csv_path = "C:/Users/HARINI SRI/Documents/internship backend/resume data 1.csv"
match_resume_to_domains(resume_pdf_path, csv_path)

