from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse 
from .models import UserAccount  
from .serializers import UserAccountSerializer ,UserSerializer,AccountSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
# Pagination configuration (if need to implement it on backend)
class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

@api_view(['GET'])
def user_list(request):
    """
    List all users with pagination.
    """
    paginator = CustomPagination()
    users = UserAccount.objects.all()
    result_page = paginator.paginate_queryset(users, request)
    serializer = UserAccountSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def user_detail(request, pk):
    """
    Retrieve a user by their ID.
    """
    user = get_object_or_404(UserAccount, pk=pk)
    serializer = UserAccountSerializer(user)
    return JsonResponse(serializer.data)

@api_view(['POST'])
def user_create(request):
    """
    Create a new UserAccount.
    """
    try:
        data = request.data
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        age = data.get('age')
        gender = data.get('gender')
        city = data.get('city')

        # Check for missing fields
        if not (first_name and last_name and age and gender and city):
            raise ValueError("Missing required fields")

        user_data = {
            'username': f"{first_name.lower()}_{last_name.lower()}",
            'first_name': first_name,
            'last_name': last_name,
        }
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        # Create UserAccount instance
        user_account_data = {
            'user': user.id, 
            'age': age,
            'gender': gender,
            'city': city
        }

        user_account_serializer = UserAccountSerializer(data=user_account_data)
        user_account_serializer.is_valid(raise_exception=True)
        user_account_serializer.save()

        return JsonResponse(user_account_serializer.data, status=status.HTTP_201_CREATED)

    except ValueError as ve:
        return JsonResponse({'message': str(ve)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def user_update(request, pk):
    """
    Update an existing UserAccount.
    """
    try:
        user_account = UserAccount.objects.get(pk=pk)
    except UserAccount.DoesNotExist:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND)

    user = user_account.user
    user_serializer = UserSerializer(user, data=request.data, partial=True) 
    if user_serializer.is_valid():
        user_serializer.save()

    serializer = UserAccountSerializer(user_account, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def user_delete(request, pk):
    """
    Delete an existing UserAccount.
    """
    try:
        user_profile = UserAccount.objects.get(pk=pk)
    except UserAccount.DoesNotExist:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND)

    user = user_profile.user
    user.delete()
    user_profile.delete()
    
    return JsonResponse({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def user_filter(request):
    """
    Filter the list of users based on different criteria (first_name, last_name, age, gender, city).
    """
    queryset = UserAccount.objects.all()
    
    # Filter by first_name
    first_name = request.query_params.get('first_name', None)
    if first_name is not None:
        queryset = queryset.filter(user__first_name__icontains=first_name)
    
    # Filter by last_name
    last_name = request.query_params.get('last_name', None)
    if last_name is not None:
        queryset = queryset.filter(user__last_name__icontains=last_name)
    
    # Filter by age
    age = request.query_params.get('age', None)
    if age is not None:
        queryset = queryset.filter(age=age)
    
    # Filter by gender
    gender = request.query_params.get('gender', None)
    if gender is not None:
        queryset = queryset.filter(gender=gender)
    
    # Filter by city
    city = request.query_params.get('city', None)
    if city is not None:
        queryset = queryset.filter(city__icontains=city)

    serializer = UserAccountSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def signup(request):
    serializer = AccountSerializer(data=request.data)
    if serializer.is_valid():
        password = serializer.validated_data['password']
        username = serializer.validated_data['username']
        user = User.objects.create_user(email=username,username=username, password=password)
        if user:
            token = Token.objects.create(user=user)
            return JsonResponse({'token': token.key, 'user': serializer.data})
    return JsonResponse(serializer.errors, status=status.HTTP_200_OK)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if username and password:
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            serializer = AccountSerializer(user)
            return JsonResponse({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    return JsonResponse({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def test_token(request):
    return JsonResponse("passed!", status=status.HTTP_200_OK)