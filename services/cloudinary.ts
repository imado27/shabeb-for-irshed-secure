
export const uploadToCloudinary = async (file: File): Promise<string | null> => {
  const cloudName = "dxqbn7i5l";
  const uploadPreset = "shabeb-for-irshed";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudinary Error Response:", errorText);
        return null; // نعيد null عند فشل الرد من السيرفر بدلاً من رابط blob مؤقت
    }

    const data = await response.json();
    return data.secure_url || null;
  } catch (error) {
    console.error("Upload connection error:", error);
    return null; // نعيد null عند حدوث خطأ في الاتصال
  }
};
