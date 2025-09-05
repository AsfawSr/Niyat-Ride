package com.niyat.ride.dispatcher.services;

import com.niyat.ride.dispatcher.dtos.DispatcherResponseDTO;
import com.niyat.ride.dispatcher.dtos.DispatcherSignupDTO;
import com.niyat.ride.dispatcher.dtos.DispatcherUpdateDTO;
import com.niyat.ride.dispatcher.mappers.DispatcherMapper;
import com.niyat.ride.dispatcher.models.Dispatcher;
import com.niyat.ride.dispatcher.repositories.DispatcherRepository;
import com.niyat.ride.enums.Role;
import com.niyat.ride.user.models.Credential;
import com.niyat.ride.shared.repositories.CredentialRepository;
import com.niyat.ride.utils.Helpers;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DispatcherServiceImpl implements DispatcherService {

    private final DispatcherRepository dispatcherRepository;
    private final DispatcherMapper dispatcherMapper;
    private final CredentialRepository credentialRepository;

    @Override
    @Transactional
    public DispatcherResponseDTO signUpDispatcher(DispatcherSignupDTO dispatcherSignupDTO) {
        dispatcherRepository.findByPhoneNumber(dispatcherSignupDTO.getPhoneNumber())
                .ifPresent(d -> { throw new RuntimeException("Dispatcher with phone already exists"); });

        dispatcherRepository.findByEmail(dispatcherSignupDTO.getEmail())
                .ifPresent(d -> { throw new RuntimeException("Dispatcher with email already exists"); });

        Dispatcher dispatcher = dispatcherMapper.toEntity(dispatcherSignupDTO);
        dispatcher.setRole(Role.dispatcher);
        dispatcher.setCreatedAt(LocalDateTime.now());
        dispatcher.setUpdatedAt(LocalDateTime.now());

        Dispatcher savedDispatcher = dispatcherRepository.save(dispatcher);

        Credential credential = new Credential();
        credential.setEmail(dispatcherSignupDTO.getEmail());
        credential.setUser(savedDispatcher);
        credential.setPasswordHash(Helpers.encryptPassword(dispatcherSignupDTO.getPassword()));
        credentialRepository.save(credential);

        return dispatcherMapper.toResponseDTO(savedDispatcher);
    }

    @Override
    @Transactional
    public DispatcherResponseDTO updateDispatcher(Long dispatcherId, DispatcherUpdateDTO updateDTO) {
        Dispatcher dispatcher = dispatcherRepository.findById(dispatcherId)
                .orElseThrow(() -> new RuntimeException("Dispatcher not found with id: " + dispatcherId));

        if (updateDTO.getEmail() != null) {
            dispatcher.setEmail(updateDTO.getEmail());
        }
        if (updateDTO.getAssignedRegion() != null) {
            dispatcher.setAssignedRegion(updateDTO.getAssignedRegion());
        }
        dispatcher.setUpdatedAt(LocalDateTime.now());

        Dispatcher updatedDispatcher = dispatcherRepository.save(dispatcher);

        if (updateDTO.getPassword() != null && !updateDTO.getPassword().isBlank()) {
            Credential credential = credentialRepository.findByUserId(dispatcherId)
                    .orElseThrow(() -> new RuntimeException("Credentials not found for dispatcher"));
            credential.setPasswordHash(Helpers.encryptPassword(updateDTO.getPassword()));
            credentialRepository.save(credential);
        }

        return dispatcherMapper.toResponseDTO(updatedDispatcher);
    }
}
