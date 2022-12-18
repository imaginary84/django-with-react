from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from rest_framework.views import APIView
from rest_framework.generics import (
    GenericAPIView,
    ListCreateAPIView,
    ListAPIView,
    RetrieveDestroyAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework import mixins
from rest_framework.viewsets import ModelViewSet
from rest_framework.pagination import PageNumberPagination

from .models import Blog, File, Tag
from .serializers import (
    BlogSerializer,
    FileSerializer,
    TagSerializer,
    BlogListSerializer,
    BlogDetailSerializer,
)


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


class StandardResultsSetPagination(PageNumberPagination):
    # page_size = 3
    page_size_query_param = "page_size"
    max_page_size = 1000


class BlogList2(ListCreateAPIView):
    queryset = Blog.objects.all().select_related("author").prefetch_related("file_set")
    serializer_class = BlogListSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = super().get_queryset()
        return qs


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
        print("Hantler put 3333333-2", request, request.data)
        # Hantler put 3333333-2 <rest_framework.request.Request: PUT '/blog/42/'> {'title': '애국가3', 'content': '동해물과 백두산이 마르고 닳도록 \n하느님이 보우하사 우리나라만세\n무궁화 삼천리 화려강산\n대한사람대한으로 길이 보전하세.3', 'test': 'HJS-TEST'}
        serializer = BlogSerializer(instance=blog, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk, *args, **kwargs):
        blog = Blog.objects.get(pk=pk)
        blog.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BlogDetail1(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    GenericAPIView,
):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(self, request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        print("Hantler patch")
        return self.partial_update(self, request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(self, request, *args, **kwargs)


class BlogDetail2(RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogDetailSerializer


class BlogViewSet(ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer


class FileList(ListAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer


class FileDetail(RetrieveDestroyAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer


class TagList(ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    # permission_classes = permissions.AllowAny

    def list(self, request, *args, **kwargs):
        print("목록 조회중.")
        return super().list(request, *args, **kwargs)
