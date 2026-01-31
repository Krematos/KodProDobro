package com.kodprodobro.kodprodobro.event;

import com.kodprodobro.kodprodobro.models.user.User;

public record UserRegisterEvent(User user) {
    public boolean getUser() {
        return user != null;
    }
}
