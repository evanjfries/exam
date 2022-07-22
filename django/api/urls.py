from django.urls import URLPattern, path
from api import views

urlpatterns = [
    path('test', views.index, name='index'),
    path('survey', views.post, name='God lets hope this works'),
    path('survey/<int:id>', views.get, name='get'),
]
