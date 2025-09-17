package com.niyat.ride.shared.services;

import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {
    String uploadFile(MultipartFile file, String directory) throws Exception;
    void deleteFile(String filePath) throws Exception;
    boolean isValidImageFile(MultipartFile file);
}
