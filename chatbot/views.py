from django.shortcuts import render
import json
from django.http import JsonResponse
from google import genai
from django.views.decorators.csrf import csrf_exempt

from .models import *

def index(request):
    return render(request, "chatbot/index.html", {
        "settings": Setting.objects.all(),
    })


@csrf_exempt
def question(request):

    client = genai.Client(api_key="API_KEY")
    data = json.loads(request.body)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=data.get("question"),
        config={"response_mime_type": "application/json",},
    )

    return JsonResponse([response.text], safe=False)