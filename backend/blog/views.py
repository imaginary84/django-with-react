from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView, ListCreateAPIView
from rest_framework import mixins

from .models import Blog, File
from .serializers import BlogSerializer, FileSerializer


@api_view(["POST", "GET"])
def blog_create_list(request):
    if request.method == "GET":
        blog_list = Blog.objects.all()
        serializer = BlogSerializer(instance=blog_list, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        # print("request.data -", request.data)

        files = request.data.getlist("files")

        serializer = BlogSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        blog = serializer.save(author=request.user)

        for file in files:
            f = File.objects.create(file=file, blog=blog)
            blog.file_set.add(f)

        return Response(serializer.data)


class BlogList0(APIView):
    def get(self, request, *args, **kwargs):
        blog_list = Blog.objects.all()
        serializer = BlogSerializer(instance=blog_list, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        files = request.data.getlist("files")

        serializer = BlogSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        blog = serializer.save(author=request.user)

        for file in files:
            f = File.objects.create(file=file, blog=blog)
            blog.file_set.add(f)

        return Response(serializer.data)


class BlogList1(mixins.ListModelMixin, mixins.CreateModelMixin, GenericAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class BlogList2(ListCreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer


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


class BlogDetail0(APIView):
    def get(self, request, pk, *args, **kwargs):
        blog = Blog.objects.get(pk=pk)
        serializer = BlogSerializer(instance=blog)
        return Response(serializer.data)

    def patch(self, request, pk, *args, **kwargs):
        blog = Blog.objects.get(pk=pk)
        serializer = BlogSerializer(instance=blog, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        blog = Blog.objects.get(pk=pk)
        serializer = BlogSerializer(instance=blog, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk, *args, **kwargs):
        blog = Blog.objects.get(pk=pk)
        blog.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
