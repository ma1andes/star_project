from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework import exceptions, permissions
from rest_framework import status
from rest_framework.response import Response
from .serializers import *


@api_view(["POST"])
def register(request):
    serializer = UserAuthSerializer(data=request.data, auth_mode="register")
    if serializer.is_valid():
        user = serializer.save()
        token = Token.objects.create(user=user)
        return Response(
            {
                "data": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "auth_token": token.key,
                }
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {"data": None, "errors": {"code": 422, "details": serializer.errors}},
        status=status.HTTP_422_UNPROCESSABLE_ENTITY,
    )


@api_view(["POST"])
def login(request):
    serializer = UserAuthSerializer(data=request.data, auth_mode="login")
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "data": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "isAdmin": user.is_staff,
                    "role": user.role,
                    "auth_token": token.key,
                }
            },
            status=status.HTTP_200_OK,
        )
    return Response(
        {"data": None, "errors": {"code": 422, "details": serializer.errors}},
        status=status.HTTP_422_UNPROCESSABLE_ENTITY,
    )


@api_view(["GET"])
def get_me(request):
    return Response({"user": UserAuthSerializer(request.user).data}, status=200)


@api_view(["GET"])
def logout(request):
    if not request.user.is_authenticated:
        return Response(
            {"message": "Вы не авторизованы"}, status=status.HTTP_401_UNAUTHORIZED
        )
    else:
        # Удаляем токен пользователя
        try:
            request.user.auth_token.delete()
        except:
            pass  # Токен может не существовать
        return Response(
            {"message": "Успешный выход из системы"}, status=status.HTTP_200_OK
        )


@api_view(["GET"])
def get_concert(request):
    concert = ConcertModel.objects.all()
    serializers = ConcertSerializer(concert, many=True)
    return Response(
        {"data": serializers.data, "errors": None}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
def get_product_detail(request, id):
    product = get_object_or_404(ProductModel, id=id)
    serializer = ProductSerializer(product)
    return Response(
        {"data": serializer.data, "errors": None}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
def get_product(request):
    product = ProductModel.objects.all()
    type = request.query_params.get("type", None)
    title = request.query_params.get("title", None)

    if type:
        product = product.filter(type__icontains=type)

    if title:
        product = product.filter(title__icontains=title)

    serializers = ProductSerializer(product, many=True)
    return Response(
        {"data": serializers.data, "errors": None}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def get_cart(request):
    cart, _ = CartModel.objects.get_or_create(user=request.user)
    cartitem = CartItemModel.objects.filter(cart=cart)
    serializers = CartSerializer(cartitem, many=True)
    return Response(
        {"data": serializers.data, "errors": None}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
def create_concert(request):
    if request.user.role == "admin":
        serializers = ConcertSerializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(
                {"data": serializers.data, "errors": None},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"data": None, "errors": {"code": 422, "details": serializers.errors}},
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )


@api_view(["POST"])
def create_product(request):
    if request.user.role == "admin":
        serializers = ProductSerializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(
                {"data": serializers.data, "errors": None},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"data": None, "errors": {"code": 422, "details": serializers.errors}},
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def add_product_in_cart(request, id):
    product = get_object_or_404(ProductModel, id=id)
    cart, _ = CartModel.objects.get_or_create(user=request.user)
    CartItemModel.objects.create(cart=cart, product=product)
    return Response(
        {"data": {"id": cart.id, "product_id": product.id}},
        status=status.HTTP_201_CREATED,
    )

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_product_in_cart(request, id):
    cart_item = get_object_or_404(CartItemModel, id=id)
    if request.method == 'DELETE':
        cart_item.delete()
        return Response(
            {"message": "success", "data": None}, status=status.HTTP_200_OK
        )



@api_view(["DELETE", "PATCH"])
@permission_classes([permissions.IsAuthenticated])
def change_product(request, id):
    if request.user.role == "admin":
        product = get_object_or_404(ProductModel, id=id)
        if request.method == "PATCH":
            serializers = ProductSerializer(product, partial=True, data=request.data)
            if serializers.is_valid():
                serializers.save()
                return Response({"data": serializers.data}, status=status.HTTP_200_OK)
            return Response(
                {
                    "message": "error",
                    "error": {
                        "code": 422,
                        "details": "Validation error",
                        "errors": serializers.errors,
                    },
                    "data": None,
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        elif request.method == "DELETE":
            product.delete()
            return Response(
                {"message": "success", "data": None}, status=status.HTTP_200_OK
            )
    return Response(
        {"data": None, "errors": {"code": 401, "error": "Permission denied"}},
        status=status.HTTP_401_UNAUTHORIZED,
    )


@api_view(["DELETE", "PATCH"])
@permission_classes([permissions.IsAuthenticated])
def change_concert(request, id):
    if request.user.role == "admin":
        concert = get_object_or_404(ConcertModel, id=id)
        if request.method == "PATCH":
            serializers = ConcertSerializer(concert, partial=True, data=request.data)
            if serializers.is_valid():
                serializers.save()
                return Response({"data": serializers.data}, status=status.HTTP_200_OK)
            return Response(
                {
                    "message": "error",
                    "error": {
                        "code": 422,
                        "details": "Validation error",
                        "errors": serializers.errors,
                    },
                    "data": None,
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        elif request.method == "DELETE":
            concert.delete()
            return Response(
                {"message": "success", "data": None}, status=status.HTTP_200_OK
            )
    return Response(
        {"data": None, "errors": {"code": 401, "error": "Permission denied"}},
        status=status.HTTP_401_UNAUTHORIZED,
    )


@api_view(["POST"])
def qa(request):
    if request.user.role == "qa" or "admin":
        serializers = QAserializers(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response({"data": serializers.data})
        return Response(
            {
                "message": "error",
                "error": {
                    "code": 422,
                    "details": "Validation error",
                    "errors": serializers.errors,
                },
                "data": None,
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )
    return Response(
        {"data": None, "errors": {"code": 401, "error": "Permission denied"}},
        status=status.HTTP_401_UNAUTHORIZED,
    )


@api_view(["GET"])
def get_qa(request):
    if request.user.role == "qa" or "admin":
        qa = QAmodel.objects.all()
        serializers = QAserializers(qa, many=True)
        return Response(
            {"data": serializers.data, "errors": None}, status=status.HTTP_200_OK
        )
    return Response(
        {"data": None, "errors": {"code": 401, "error": "Permission denied"}},
        status=status.HTTP_401_UNAUTHORIZED,
    )


@api_view(["DELETE", "PATCH"])
@permission_classes([permissions.IsAuthenticated])
def change_qa(request, id):
    if request.user.role == "qa":
        qa = get_object_or_404(QAmodel, id=id)
        if request.method == "PATCH":
            serializers = QAserializers(qa, partial=True, data=request.data)
            if serializers.is_valid():
                serializers.save()
                return Response({"data": serializers.data}, status=status.HTTP_200_OK)
            return Response(
                {
                    "message": "error",
                    "error": {
                        "code": 422,
                        "details": "Validation error",
                        "errors": serializers.errors,
                    },
                    "data": None,
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        elif request.method == "DELETE":
            qa.delete()
            return Response(
                {"message": "success", "data": None}, status=status.HTTP_200_OK
            )
    return Response(
        {"data": None, "errors": {"code": 401, "error": "Permission denied"}},
        status=status.HTTP_401_UNAUTHORIZED,
    )


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def create_video(request):
    if request.user.role == "user":
        serializer = VideoSerializers(data=request.data)
        if serializer.is_valid():
            video = serializer.save()
            VideoRequest.objects.create(video=video)
            return Response(
                {"data": serializer.data, "error": None}, status=status.HTTP_201_CREATED
            )
        return Response(
            {
                "message": "error",
                "error": {
                    "code": 422,
                    "details": "Validation error",
                    "errors": serializer.errors,
                },
                "data": None,
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )
    else:
        return Response(
            {
                "error": {
                    "code": 403,
                    "details": "Только пользователи с ролью 'user' могут создавать заявки.",
                }
            },
            status=status.HTTP_403_FORBIDDEN,
        )


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def get_video_requests(request):
    if request.user.role != "admin":
        return Response(
            {"error": {"code": 403, "details": "Доступ запрещён"}},
            status=status.HTTP_403_FORBIDDEN,
        )

    requests = (
        VideoRequest.objects.select_related("video").all().order_by("-created_at")
    )
    data = []
    for req in requests:
        data.append(
            {
                "id": req.id,
                "full_name": req.video.full_name,
                "email": req.video.email,
                "phone": req.video.phone,
                "age": req.video.age,
                "desc": req.video.desc,
                "hobbies": req.video.hobbies,
                "date_birthday": req.video.date_birthday,
                "price": req.video.price,
                "count": req.video.count,
                "created_at": req.created_at,
                "is_viewed": req.is_viewed,
            }
        )

    return Response({"data": data}, status=status.HTTP_200_OK)


@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def update_video_request_status(request, id):
    if request.user.role != "admin":
        return Response(
            {"error": {"code": 403, "details": "Доступ запрещён"}},
            status=status.HTTP_403_FORBIDDEN,
        )
    req = VideoRequest.objects.get(id=id)
    serializer = VideoRequestStatusSerializer(req, data=request.data, partial=True)
    if serializer.is_valid():
        status_value = serializer.validated_data.get("status")

        if status_value == "rejected":
            req.delete()
            return Response(
                {"data": None, "message": "Заявка успешно отклонена и удалена"},
                status=status.HTTP_200_OK,
            )

        elif status_value == "accepted":
            serializer.save()
            return Response(
                {"data": serializer.data, "message": "Заявка принята"},
                status=status.HTTP_200_OK,
            )

        else:
            serializer.save()
            return Response(
                {"data": serializer.data, "message": "Статус обновлён"},
                status=status.HTTP_200_OK,
            )

    return Response(
        {"error": {"code": 400, "details": serializer.errors}},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["GET"])
def get_concerts_for_map(request):
    concerts = ConcertModel.objects.all()
    data = []
    for concert in concerts:
        data.append({
            'id': concert.id,
            'title': concert.title,
            'city': concert.city.name,
            'latitude': concert.city.latitude,
            'longitude': concert.city.longitude,
            'date': concert.date,
            'time': concert.time,
        })
    return Response({'data': data}, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_cities(request):
    """Получить все города для select поля"""
    cities = City.objects.all().order_by('name')
    serializer = CitySerializer(cities, many=True)
    return Response(
        {"data": serializer.data, "errors": None}, 
        status=status.HTTP_200_OK
    )
