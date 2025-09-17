package com.niyat.ride.otp.services;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class AfroMessageService {

    private static final String BASE_URL = "https://api.afromessage.com/api/send";
    private final String apiToken;
    private final OkHttpClient client = new OkHttpClient();

    public AfroMessageService(@Value("${afromessage.api.token}") String apiToken) {
        this.apiToken = apiToken;
    }

    public void sendSms(String recipient, String message) throws IOException {
        JSONObject jsonBody = new JSONObject()
                .put("to", recipient)
                .put("message", message);

        okhttp3.RequestBody body = okhttp3.RequestBody.create(
                jsonBody.toString(),
                okhttp3.MediaType.get("application/json; charset=utf-8")
        );

        Request request = new Request.Builder()
                .header("Authorization", "Bearer " + apiToken)
                .url(BASE_URL)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("AfroMessage API Error: " + response.code() + " - " + response.message());
            }
        }
    }
}