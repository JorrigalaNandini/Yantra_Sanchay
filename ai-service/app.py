from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from IndicTransToolkit import IndicProcessor
import torch


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="Yantra Sanchay AI Translation Service",
    version="1.0.0"
)


# =========================================================
# MODEL
# =========================================================

MODEL_NAME = "ai4bharat/indictrans2-en-indic-dist-200M"

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

print("---------------------------------------")
print("Yantra Sanchay AI Translation Service")
print("---------------------------------------")
print(f"Device: {DEVICE}")
print("Loading IndicTrans2 model...")


tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME,
    trust_remote_code=True
)

model = AutoModelForSeq2SeqLM.from_pretrained(
    MODEL_NAME,
    trust_remote_code=True
)

model = model.to(DEVICE)
model.eval()

processor = IndicProcessor(
    inference=True
)

print("IndicTrans2 loaded successfully!")
print("---------------------------------------")


# =========================================================
# REQUEST MODEL
# =========================================================

class TranslationRequest(BaseModel):

    text: str

    target_language: str


# =========================================================
# LANGUAGE CODES
# =========================================================

LANGUAGE_CODES = {

    "hi": "hin_Deva",

    "te": "tel_Telu",

    "ta": "tam_Taml",

    "kn": "kan_Knda",

    "ml": "mal_Mlym",

    "mr": "mar_Deva",

    "bn": "ben_Beng",

    "gu": "guj_Gujr",

    "pa": "pan_Guru",

    "or": "ory_Orya",

    "as": "asm_Beng",

    "ur": "urd_Arab",

    "sa": "san_Deva",

    "kok": "gom_Deva",

    "ks": "kas_Arab",

    "ne": "npi_Deva",

    "mai": "mai_Deva",

    "mni": "mni_Mtei",

    "brx": "brx_Deva",

    "doi": "doi_Deva",

    "sat": "sat_Olck"

}


# =========================================================
# TRANSLATION FUNCTION
# =========================================================

def translate_text(text, target_language):

    if target_language not in LANGUAGE_CODES:

        raise ValueError(
            f"Unsupported language: {target_language}"
        )


    target_code = LANGUAGE_CODES[target_language]

    source_code = "eng_Latn"


    # ---------------------------------------------
    # Prepare input
    # ---------------------------------------------

    batch = processor.preprocess_batch(
        [text],
        src_lang=source_code,
        tgt_lang=target_code
    )


    # ---------------------------------------------
    # Tokenize
    # ---------------------------------------------

    inputs = tokenizer(
        batch,
        padding="longest",
        truncation=True,
        return_tensors="pt"
    )


    inputs = {
        key: value.to(DEVICE)
        for key, value in inputs.items()
    }


    # ---------------------------------------------
    # Generate translation
    # ---------------------------------------------

    with torch.no_grad():

        generated_tokens = model.generate(
            **inputs,
            max_length=256,
            num_beams=5,
            num_return_sequences=1
        )


    # ---------------------------------------------
    # Decode
    # ---------------------------------------------

    generated_tokens = tokenizer.batch_decode(
        generated_tokens,
        skip_special_tokens=True
    )


    # ---------------------------------------------
    # Post-process
    # ---------------------------------------------

    translations = processor.postprocess_batch(
        generated_tokens,
        lang=target_code
    )


    return translations[0]


# =========================================================
# HOME ROUTE
# =========================================================

@app.get("/")
def home():

    return {

        "service":
        "Yantra Sanchay AI Translation Service",

        "status":
        "running",

        "model":
        MODEL_NAME,

        "device":
        DEVICE

    }


# =========================================================
# TRANSLATION API
# =========================================================

@app.post("/translate")
def translate(request: TranslationRequest):

    try:

        if not request.text.strip():

            raise HTTPException(
                status_code=400,
                detail="Text cannot be empty"
            )


        result = translate_text(
            request.text,
            request.target_language
        )


        return {

            "success": True,

            "source_language": "en",

            "target_language":
            request.target_language,

            "original":
            request.text,

            "translation":
            result

        }


    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


    except Exception as error:

        print("Translation error:", error)

        raise HTTPException(
            status_code=500,
            detail="Translation failed"
        )