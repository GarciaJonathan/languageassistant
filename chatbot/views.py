from django.shortcuts import render
import json

from django.http import JsonResponse
from google import genai
from django.views.decorators.csrf import csrf_exempt

from .models import *

import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('GEMINI_API_KEY')

def index(request):
    return render(request, "chatbot/index.html", {
        "settings": Setting.objects.all(),
    })


@csrf_exempt
def question(request):

    client = genai.Client(api_key= "AIzaSyDve85buDdfYF4YljOq__TSwMZcQXGZvNk")
    data = json.loads(request.body)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=data.get("question"),
        config={"response_mime_type": "application/json",},
    )

    return JsonResponse([response.text], safe=False)