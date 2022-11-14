from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Blog
from .serializers import BlogSerializer


@api_view(["POST", "GET"])
def blog_create_list(request):
    if request.method == "GET":
        blog_list = Blog.objects.all()
        serializer = BlogSerializer(instance=blog_list, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = BlogSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)
        return Response(serializer.data)
        # {"title":"세번째 글제목", "content":"세번째 글내용"}


@api_view(["DELETE", "GET", "PATCH", "PUT"])
def blog_detail(request, pk):

    try:
        blog = Blog.objects.get(pk=pk)

        if request.method == "GET":
            serializer = BlogSerializer(instance=blog)
            return Response(serializer.data)

        elif request.method == "PATCH":
            serializer = BlogSerializer(instance=blog, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == "PUT":
            print("put ", request.data)
            serializer = BlogSerializer(instance=blog, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == "DELETE":
            blog.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    except Blog.DoesNotExist:
        return Response({"message": "처리 할 대상이 없습니다."}, status=status.HTTP_404_NOT_FOUND)
