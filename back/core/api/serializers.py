from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import *

class RegSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['name', 'email', 'username', 'role','password']
        
    def save(self, **kwargs):
        user = UserModel(
            name = self.validated_data['name'],
            email = self.validated_data['email'],
            role = self.validated_data['role'],
            username = self.validated_data['username'],
        )
        user.set_password(self.validated_data['password'])
        user.save()
        return user
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        user = authenticate(**attrs)
        if user:
            return user
        return False
    
class ConcertSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name')
    latitude = serializers.FloatField(source='city.latitude')
    longitude = serializers.FloatField(source='city.longitude')

    class Meta:
        model = ConcertModel
        fields = ['id', 'title', 'date', 'time', 'city_name', 'latitude', 'longitude']
        
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductModel
        fields = '__all__'
        
class CartSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(source='product', queryset=ProductModel.objects.all())
    img = serializers.CharField(source='product.img')
    title = serializers.CharField(source='product.title')
    desc = serializers.CharField(source='product.desc')
    price = serializers.CharField(source='product.title')
    
    class Meta:
        model = ProductModel
        fields = ['id','product_id', 'img','title','desc', 'price']
        
class QAserializers(serializers.ModelSerializer):
    class Meta:
        model = QAmodel
        fields = '__all__'

class VideoSerializers(serializers.ModelSerializer):
    class Meta:
        model = VideoPozdravok
        fields = '__all__'

class VideoRequestStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoRequest
        fields = ['status']