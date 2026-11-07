import torch

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="Yantra Sanchay AI Translation Service",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# MODEL
# ============================================================

MODEL_NAME = "facebook/nllb-200-distilled-600M"

print("")
print("================================================")
print("Loading NLLB-200 Translation Model...")
print("================================================")
print("Model:", MODEL_NAME)


# ============================================================
# DEVICE
# ============================================================

if torch.cuda.is_available():
    device = "cuda"
else:
    device = "cpu"


print("Using device:", device)


# ============================================================
# TOKENIZER
# ============================================================

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME
)


# ============================================================
# MODEL
# ============================================================

model = AutoModelForSeq2SeqLM.from_pretrained(
    MODEL_NAME
)

model = model.to(device)

model.eval()


print("")
print("✅ NLLB-200 loaded successfully!")
print("Device:", device)
print("================================================")
print("")


# ============================================================
# LANGUAGES
# ============================================================

LANGUAGES = {

    "English": "eng_Latn",

    "Assamese": "asm_Beng",

    "Bengali": "ben_Beng",

    "Bodo": "brx_Deva",

    "Dogri": "doi_Deva",

    "Gujarati": "guj_Gujr",

    "Hindi": "hin_Deva",

    "Kannada": "kan_Knda",

    "Kashmiri": "kas_Arab",

    "Kashmiri Devanagari": "kas_Deva",

    "Konkani": "gom_Deva",

    "Maithili": "mai_Deva",

    "Malayalam": "mal_Mlym",

    "Marathi": "mar_Deva",

    "Manipuri Bengali": "mni_Beng",

    "Manipuri Meitei": "mni_Mtei",

    "Nepali": "npi_Deva",

    "Odia": "ory_Orya",

    "Punjabi": "pan_Guru",

    "Sanskrit": "san_Deva",

    "Santali": "sat_Olck",

    "Sindhi Arabic": "snd_Arab",

    "Sindhi Devanagari": "snd_Deva",

    "Tamil": "tam_Taml",

    "Telugu": "tel_Telu",

    "Urdu": "urd_Arab"

}


SOURCE_LANG = "eng_Latn"


TARGET_LANGUAGES = {
    name: code
    for name, code in LANGUAGES.items()
    if code != SOURCE_LANG
}


# ============================================================
# REQUEST MODELS
# ============================================================

class TranslationRequest(BaseModel):

    text: str

    source: str = "eng_Latn"

    target: str = "tel_Telu"


class BatchTranslationRequest(BaseModel):

    texts: list[str]

    source: str = "eng_Latn"

    target: str = "tel_Telu"


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {

        "success": True,

        "message": "Yantra Sanchay AI Service is running",

        "model": MODEL_NAME,

        "device": device,

        "languages_supported": len(TARGET_LANGUAGES)

    }


# ============================================================
# LANGUAGES
# ============================================================

@app.get("/languages")
def languages():

    return {

        "success": True,

        "languages": LANGUAGES,

        "targets": TARGET_LANGUAGES

    }


# ============================================================
# TRANSLATION FUNCTION
# ============================================================

def translate_text(
    text: str,
    source: str,
    target: str
):

    # --------------------------------------------------------
    # Validate source
    # --------------------------------------------------------

    if source != SOURCE_LANG:

        raise ValueError(
            f"This model configuration expects "
            f"source='eng_Latn'. Got: {source}"
        )


    # --------------------------------------------------------
    # Validate target
    # --------------------------------------------------------

    if target not in TARGET_LANGUAGES.values():

        raise ValueError(
            f"Unsupported target language: {target}"
        )


    # --------------------------------------------------------
    # Empty text
    # --------------------------------------------------------

    if not text or not text.strip():

        return ""


    # --------------------------------------------------------
    # Same language
    # --------------------------------------------------------

    if source == target:

        return text


    print("")
    print("--------------------------------------------")
    print("Translation")
    print("Source:", source)
    print("Target:", target)
    print("Text:", text)
    print("--------------------------------------------")


    # --------------------------------------------------------
    # Set source language
    # --------------------------------------------------------

    tokenizer.src_lang = source


    # --------------------------------------------------------
    # Tokenize
    # --------------------------------------------------------

    inputs = tokenizer(
        text,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=256
    )


    inputs = {
        key: value.to(device)
        for key, value in inputs.items()
    }


    # --------------------------------------------------------
    # Target language token
    # --------------------------------------------------------

    forced_bos_token_id = tokenizer.convert_tokens_to_ids(
        target
    )


    # --------------------------------------------------------
    # Generate
    # --------------------------------------------------------

    with torch.no_grad():

        outputs = model.generate(

            **inputs,

            forced_bos_token_id=forced_bos_token_id,

            max_length=256,

            num_beams=4

        )


    # --------------------------------------------------------
    # Decode
    # --------------------------------------------------------

    result = tokenizer.batch_decode(
        outputs,
        skip_special_tokens=True
    )[0]


    result = result.strip()


    print("Translated:", result)
    print("--------------------------------------------")


    return result


# ============================================================
# SINGLE TRANSLATION
# ============================================================

@app.post("/translate")
def translate(request: TranslationRequest):

    try:

        translated_text = translate_text(

            request.text,

            request.source,

            request.target

        )


        return {

            "success": True,

            "source": request.source,

            "target": request.target,

            "original_text": request.text,

            "translated_text": translated_text

        }


    except Exception as e:

        print("")
        print("❌ Translation error:")
        print(repr(e))


        return {

            "success": False,

            "error": str(e)

        }


# ============================================================
# BATCH TRANSLATION
# ============================================================

@app.post("/translate-batch")
def translate_batch(
    request: BatchTranslationRequest
):

    try:

        print("")
        print("============================================")
        print("BATCH TRANSLATION")
        print("============================================")


        if request.source != SOURCE_LANG:

            return {

                "success": False,

                "error":
                    f"This model configuration expects "
                    f"source='eng_Latn'. Got: {request.source}"

            }


        if request.target not in TARGET_LANGUAGES.values():

            return {

                "success": False,

                "error":
                    f"Unsupported target language: "
                    f"{request.target}"

            }


        if not request.texts:

            return {

                "success": True,

                "source": request.source,

                "target": request.target,

                "original_texts": [],

                "translations": []

            }


        print("Number of texts:", len(request.texts))
        print("Source:", request.source)
        print("Target:", request.target)


        # ----------------------------------------------------
        # Set source language
        # ----------------------------------------------------

        tokenizer.src_lang = request.source


        # ----------------------------------------------------
        # Tokenize
        # ----------------------------------------------------

        inputs = tokenizer(

            request.texts,

            return_tensors="pt",

            padding=True,

            truncation=True,

            max_length=256

        )


        inputs = {

            key: value.to(device)

            for key, value in inputs.items()

        }


        # ----------------------------------------------------
        # Target language
        # ----------------------------------------------------

        forced_bos_token_id = tokenizer.convert_tokens_to_ids(
            request.target
        )


        # ----------------------------------------------------
        # Generate
        # ----------------------------------------------------

        with torch.no_grad():

            outputs = model.generate(

                **inputs,

                forced_bos_token_id=forced_bos_token_id,

                max_length=256,

                num_beams=4

            )


        # ----------------------------------------------------
        # Decode
        # ----------------------------------------------------

        translations = tokenizer.batch_decode(

            outputs,

            skip_special_tokens=True

        )


        translations = [

            text.strip()

            for text in translations

        ]


        print("Batch translation completed!")

        print("============================================")


        return {

            "success": True,

            "source": request.source,

            "target": request.target,

            "original_texts": request.texts,

            "translations": translations

        }


    except Exception as e:

        print("")
        print("❌ Batch translation error:")
        print(repr(e))


        return {

            "success": False,

            "error": str(e)

        }