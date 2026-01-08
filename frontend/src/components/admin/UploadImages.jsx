import React, { useState, useRef, useEffect } from 'react';
import AdminLayout from '../layout/AdminLayout';
import MetaData from '../layout/MetaData';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetProductDetailsQuery, 
  useUploadProductImagesMutation,
  useDeleteProductImageMutation 
} from '../../redux/api/productsApi';
import Loader from '../layout/Loader';
import { toast } from 'react-hot-toast';

const UploadImages = () => {
  const params = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  // 1. Query to get current product images
  const { data, isLoading: isDetailsLoading } = useGetProductDetailsQuery(params?.id);

  // 2. Mutation to upload new images
  const [uploadProductImages, { isLoading: isUploading, error, isSuccess }] = 
    useUploadProductImagesMutation();

  // 3. Mutation to delete existing images
  const [deleteProductImage, { isLoading: isDeleting, error: deleteError }] = 
    useDeleteProductImageMutation();

  useEffect(() => {
    if (data?.product) {
      setUploadedImages(data?.product?.images);
    }

    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      setImagesPreview([]);
      setImages([]);
      toast.success("Images Uploaded Successfully");
      navigate("/admin/products");
    }

    

  }, [data, error, isSuccess, deleteError, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleResetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImagePreview = (image) => {
    const filteredPreview = imagesPreview.filter((img) => img !== image);
    setImagesPreview(filteredPreview);
    setImages(filteredPreview);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    uploadProductImages({ id: params?.id, body: { images } });
  };

  const deleteImageHandler = (imgId) => {
    deleteProductImage({ id: params?.id, body: { imgId } });
  };

  if (isDetailsLoading) return <Loader />;

  return (
    <AdminLayout>
      <MetaData title={"Upload Product Images"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-8 mt-5 mt-lg-0">
          <form className="shadow rounded bg-body p-4" onSubmit={submitHandler}>
            <h2 className="mb-4">Upload Product Images</h2>

            <div className="mb-3">
              <label htmlFor="customFile" className="form-label">
                Choose Images
              </label>

              <div className="custom-file">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="product_images"
                  className="form-control"
                  id="customFile"
                  multiple
                  onChange={handleImageChange}
                  onClick={handleResetFileInput}
                />
              </div>

              {/* New Images Previews (Locally selected) */}
              {imagesPreview.length > 0 && (
                <div className="new-images my-4">
                  <p className="text-warning">New Images Previews:</p>
                  <div className="row mt-4">
                    {imagesPreview.map((img, index) => (
                      <div key={index} className="col-md-3 mt-2">
                        <div className="card">
                          <img
                            src={img}
                            alt="Preview"
                            className="card-img-top p-2"
                            style={{ width: "100%", height: "80px", objectFit: "cover" }}
                          />
                          <button
                            type="button"
                            className="btn btn-block btn-danger cross-button mt-1 py-0"
                            onClick={() => removeImagePreview(img)}
                            style={{ backgroundColor: "#cd2121ff", borderColor: "#ff0707ff", color: "white" }}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Uploaded Images (From Database) */}
              {uploadedImages?.length > 0 && (
                <div className="uploaded-images my-4">
                  <p className="text-success">Product Uploaded Images:</p>
                  <div className="row mt-1">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="col-md-3 mt-2">
                        <div className="card">
                          <img
                            src={img?.url}
                            alt="Uploaded"
                            className="card-img-top p-2"
                            style={{ width: "100%", height: "80px", objectFit: "cover" }}
                          />
                          <button
                            className="btn btn-block btn-danger cross-button mt-1 py-0"
                            type="button"
                            disabled={isDeleting || isUploading}
                            onClick={() => deleteImageHandler(img.public_id)}
                            style={{ backgroundColor: "#dc3545", borderColor: "#dc3545" }}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={isUploading || isDeleting || images.length === 0}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UploadImages;