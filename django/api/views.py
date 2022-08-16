import statistics
from django.shortcuts import render
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from .serializer import SurveySerializer
from .models import Survey

@api_view(['GET'])
def index(request):
    return Response({'Test': 'It works!'})

@api_view(['POST'])
def post(request):
    serializer = SurveySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get(request, id):
    try:
        survey = Survey.objects.get(id=id)
    except Survey.DoesNotExist:
        return HttpResponse(status=404)
    serializer = SurveySerializer(survey)
    return Response(serializer.data)