package com.niyat.ride.utils.file;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class BaseFileProcessor {

    @Value("${files.upload.base-dir:uploads}")
    private String baseDir;

    @Value("${files.upload.max-size-bytes:5242880}")
    private long maxSizeBytes;

    @Value("${files.upload.allowed-content-types:image/jpeg,image/png,application/pdf}")
    private String allowedContentTypesProp;

    private Set<String> allowedContentTypes;

    @PostConstruct
    void init() throws IOException {
        // Normalize and create base dir
        Path basePath = Paths.get(baseDir).toAbsolutePath().normalize();
        Files.createDirectories(basePath);
        // Parse allowed content types
        try (Stream<String> stream = Stream.of(allowedContentTypesProp.split(","))) {
            allowedContentTypes = stream.map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toSet());
        }
    }

    public String saveSingle(MultipartFile file, String subfolder) throws IOException {
        validateFile(file);
        Path targetDir = resolveAndCreate(subfolder);
        String uniqueName = buildUniqueFilename(file.getOriginalFilename());
        Path target = targetDir.resolve(uniqueName);
        Files.copy(file.getInputStream(), target);
        return target.toAbsolutePath().toString();
    }

    public List<String> saveMultiple(List<MultipartFile> files, String subfolder) throws IOException {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("No files provided");
        }
        List<String> paths = new ArrayList<>();
        for (MultipartFile f : files) {
            paths.add(saveSingle(f, subfolder));
        }
        return paths;
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or missing");
        }
        if (file.getSize() > maxSizeBytes) {
            throw new IllegalArgumentException("File exceeds maximum allowed size");
        }
        String contentType = file.getContentType();
        if (contentType == null || !allowedContentTypes.contains(contentType)) {
            throw new IllegalArgumentException("Unsupported file type: " + contentType);
        }
    }

    private Path resolveAndCreate(String subfolder) throws IOException {
        Path dir = Paths.get(baseDir, subfolder).toAbsolutePath().normalize();
        Files.createDirectories(dir);
        return dir;
    }

    private String buildUniqueFilename(String originalFilename) {
        String ext = "";
        if (StringUtils.hasText(originalFilename) && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf('.'));
        }
        return UUID.randomUUID() + ext;
    }
}
