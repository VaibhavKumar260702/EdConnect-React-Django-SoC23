from rest_framework.serializers import ModelSerializer
from .models import Admin_info,Ta_info,Student_info

class Admin_infoSerializer(ModelSerializer):
    class Meta:
        model =  Admin_info
        fields = '__all__'

class Ta_infoSerializer(ModelSerializer):
    class Meta:
        model =  Ta_info
        fields = '__all__'

class Student_infoSerializer(ModelSerializer):
    class Meta:
        model =  Student_info
        fields = '__all__'