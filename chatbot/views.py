from django.shortcuts import render
import json
from django.http import JsonResponse
from google import genai
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request, "chatbot/index.html", {
    })


@csrf_exempt
def question(request):

    client = genai.Client(api_key="API_KEY")
    data = json.loads(request.body)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=data.get("question"),
    )

    return JsonResponse([response.text], safe=False)