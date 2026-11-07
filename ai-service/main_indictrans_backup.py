import os
import torch

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from transformers import (
    AutoTokenizer,
    AutoModelForSeq2SeqLM
)

from IndicTransToolkit.processor import IndicProcessor


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

# AI4Bharat IndicTrans2 — EN -> INDIC
#
# IMPORTANT: There are 3 separate IndicTrans2 checkpoints:
#   - en-indic     -> English to Indic   (THIS is what you need,
#                                          since your frontend always
#                                          sends source = eng_Latn)
#   - indic-en     -> Indic to English
#   - indic-indic  -> Indic to Indic ONLY (does NOT support English
#                                           as source or target — this
#                                           was the bug in your old code)
#
# Use the 1B checkpoint instead of dist-200M if you have a GPU and
# want noticeably better translation quality.

MODEL_NAME = "ai4bharat/indictrans2-en-indic-dist-200M"

print("")
print("================================================")
print("Loading AI4Bharat IndicTrans2 (EN -> Indic)...")
print("================================================")
print("Model:", MODEL_NAME)


HF_TOKEN = os.environ.get("HF_TOKEN")


# ============================================================
# LOAD TOKENIZER
# ============================================================

tokenizer = AutoTokenizer.from_pretrained(

    MODEL_NAME,

    trust_remote_code=True,

    token=HF_TOKEN

)


# ============================================================
# LOAD MODEL
# ============================================================

model = AutoModelForSeq2SeqLM.from_pretrained(

    MODEL_NAME,

    trust_remote_code=True,

    token=HF_TOKEN

)


# ============================================================
# INDIC PROCESSOR
# ============================================================
#
# IndicTrans2 REQUIRES this preprocessing/postprocessing step.
# It handles:
#   - Unicode/script normalization
#   - Sentence splitting
#   - Number / date / entity placeholder masking (so the model
#     doesn't mistranslate digits, URLs, etc.)
#   - Detokenization + placeholder restoration on the output
#
# Skipping this (as the old code did) is why translations were
# low quality / broken even though no exception was raised.

ip = IndicProcessor(inference=True)


# ============================================================
# DEVICE
# ============================================================

if torch.cuda.is_available():

    device = "cuda"

else:

    device = "cpu"


model = model.to(device)

model.eval()


print("")
print("✅ IndicTrans2 (EN -> Indic) loaded successfully!")
print("Using device:", device)
print("================================================")
print("")


# ============================================================
# SUPPORTED LANGUAGES
# ============================================================
#
# eng_Latn is only ever the SOURCE (your app is English -> Indic
# only), so it is intentionally excluded from the target-capable
# list used for validation below. It's kept here so /languages
# still reports it for the dropdown if you want.

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
# LANGUAGES API
# ============================================================

@app.get("/languages")
def languages():

    return {

        "success": True,

        "languages": LANGUAGES,

        "targets": TARGET_LANGUAGES

    }


# ============================================================
# TRANSLATE FUNCTION
# ============================================================

def translate_text(
    text: str,
    source: str,
    target: str
):

    # --------------------------------------------------------
    # Validate languages
    #
    # This model only translates FROM English. If you later add
    # an indic-en or indic-indic model, branch on that here.
    # --------------------------------------------------------

    if source != SOURCE_LANG:

        raise ValueError(
            f"This model only supports source='eng_Latn'. Got: {source}"
        )


    if target not in TARGET_LANGUAGES.values():

        raise ValueError(
            f"Unsupported target language: {target}"
        )


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
    # Preprocess (REQUIRED for IndicTrans2)
    # --------------------------------------------------------

    batch = ip.preprocess_batch(
        [text],
        src_lang=source,
        tgt_lang=target
    )


    # --------------------------------------------------------
    # Tokenize
    # --------------------------------------------------------

    inputs = tokenizer(

        batch,

        return_tensors="pt",

        padding=True,

        truncation=True,

        max_length=256

    )


    # Move tensors to CPU/GPU

    inputs = {

        key: value.to(device)

        for key, value in inputs.items()

    }


    # --------------------------------------------------------
    # Generate
    # --------------------------------------------------------

    with torch.no_grad():

        outputs = model.generate(

            **inputs,

            max_length=256,

            num_beams=4,

            early_stopping=True

        )


    # --------------------------------------------------------
    # Decode
    # --------------------------------------------------------

    decoded = tokenizer.batch_decode(

        outputs,

        skip_special_tokens=True,

        clean_up_tokenization_spaces=True

    )


    # --------------------------------------------------------
    # Postprocess (restores entities/placeholders, REQUIRED)
    # --------------------------------------------------------

    result = ip.postprocess_batch(decoded, lang=target)[0]

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

        print(
            "Number of texts:",
            len(request.texts)
        )

        print(
            "Source:",
            request.source
        )

        print(
            "Target:",
            request.target
        )


        # ----------------------------------------------------
        # Validate
        # ----------------------------------------------------

        if request.source != SOURCE_LANG:

            return {

                "success": False,

                "error": f"This model only supports source='eng_Latn'. Got: {request.source}"

            }


        if request.target not in TARGET_LANGUAGES.values():

            return {

                "success": False,

                "error": f"Unsupported target language: {request.target}"

            }


        # ----------------------------------------------------
        # Same language
        # ----------------------------------------------------

        if request.source == request.target:

            return {

                "success": True,

                "source": request.source,

                "target": request.target,

                "translations": request.texts

            }


        # ----------------------------------------------------
        # Preprocess (REQUIRED for IndicTrans2)
        # ----------------------------------------------------

        batch = ip.preprocess_batch(

            request.texts,

            src_lang=request.source,

            tgt_lang=request.target

        )


        # ----------------------------------------------------
        # Tokenize batch
        # ----------------------------------------------------

        inputs = tokenizer(

            batch,

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
        # Generate batch
        # ----------------------------------------------------

        with torch.no_grad():

            outputs = model.generate(

                **inputs,

                max_length=256,

                num_beams=4,

                early_stopping=True

            )


        # ----------------------------------------------------
        # Decode
        # ----------------------------------------------------

        decoded = tokenizer.batch_decode(

            outputs,

            skip_special_tokens=True,

            clean_up_tokenization_spaces=True

        )


        # ----------------------------------------------------
        # Postprocess (REQUIRED)
        # ----------------------------------------------------

        translations = ip.postprocess_batch(decoded, lang=request.target)

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