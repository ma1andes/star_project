from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import *


class UserAuthSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserModel
        fields = ["name", "email", "username", "role", "password"]
        extra_kwargs = {
            "name": {"required": False},
            "username": {"required": False},
            "role": {"required": False},
        }

    def __init__(self, *args, **kwargs):
        self.auth_mode = kwargs.pop("auth_mode", "register")
        super().__init__(*args, **kwargs)

        if self.auth_mode == "login":
            self.fields.pop("name", None)
            self.fields.pop("username", None)
            self.fields.pop("role", None)

    def validate(self, attrs):
        if self.auth_mode == "login":
            user = authenticate(
                email=attrs.get("email"), password=attrs.get("password")
            )
            if not user:
                raise serializers.ValidationError("Неверный email или пароль.")
            return {"user": user}
        return super().validate(attrs)

    def create(self, validated_data):
        user = UserModel(
            name=validated_data.get("name"),
            email=validated_data["email"],
            username=validated_data.get("username"),
            role=validated_data.get("role"),
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class ConcertSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    latitude = serializers.FloatField(source='city.latitude', read_only=True)
    longitude = serializers.FloatField(source='city.longitude', read_only=True)

    class Meta:
        model = ConcertModel
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductModel
        fields = "__all__"


class CartSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        source="product", queryset=ProductModel.objects.all()
    )
    img = serializers.CharField(source="product.img")
    title = serializers.CharField(source="product.title")
    desc = serializers.CharField(source="product.desc")
    type = serializers.CharField(source="product.type")
    price = serializers.CharField(source="product.title")

    class Meta:
        model = ProductModel
        fields = ["id", "product_id", "img", "title",'type', "desc", "price"]


class QAserializers(serializers.ModelSerializer):
    class Meta:
        model = QAmodel
        fields = "__all__"


class VideoSerializers(serializers.ModelSerializer):
    class Meta:
        model = VideoPozdravok
        fields = "__all__"


class VideoRequestStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoRequest
        fields = ["status"]


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["id", "name", "slug"]
