# ClusterFuzzLite build image for the fuzz targets in fuzz/.
# The base image is pinned by digest (OpenSSF Scorecard: Pinned-Dependencies);
# Dependabot's docker ecosystem keeps it current.
FROM gcr.io/oss-fuzz-base/base-builder-python:v1@sha256:21f6fab17ace4dc76e1c56de91ee95d3d03da021df94b41056ba036f6c6f55e9
COPY . $SRC/dagwick
WORKDIR $SRC/dagwick
COPY .clusterfuzzlite/build.sh $SRC/
