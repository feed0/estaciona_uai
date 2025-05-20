package com.chameleon.estaciona_uai.api.user.base_user;

import com.chameleon.estaciona_uai.api.user.base_user.dto.BaseUserLoginResponse;
import com.chameleon.estaciona_uai.api.user.base_user.exception.BaseUserLoginInvalidCredentialsException;
import com.chameleon.estaciona_uai.api.user.base_user.exception.BaseUserNotFoundException;
import com.chameleon.estaciona_uai.api.user.base_user.exception.UnexpectedBaseUserTypeException;
import com.chameleon.estaciona_uai.domain.user.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BaseUserService {

    private final BaseUserRepository baseUserRepository;

    @Autowired
    public BaseUserService(BaseUserRepository baseUserRepository) {
        this.baseUserRepository = baseUserRepository;
    }

    public BaseUserLoginResponse login(String email, String password) {

        BaseUser user = baseUserRepository.findByEmail(email)
                .orElseThrow(() -> new BaseUserNotFoundException(email));

        if (!user.getPassword().equals(password)) {
            throw new BaseUserLoginInvalidCredentialsException(email);
        }

        UserType userType;
        if (user instanceof Manager) {userType = UserType.MANAGER;}
        else if (user instanceof Admin) {userType = UserType.ADMIN;}
        else if (user instanceof Customer) {userType = UserType.CUSTOMER;}
        else {throw new UnexpectedBaseUserTypeException(email);}

        return new BaseUserLoginResponse(user.getId(), userType);
    }
}