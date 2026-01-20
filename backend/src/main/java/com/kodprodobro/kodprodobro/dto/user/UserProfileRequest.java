package com.kodprodobro.kodprodobro.dto.user;


public record UserProfileRequest(String firstName,
                                 String lastName,
                                 String bio,
                                 String location,
                                 String websiteUrl
) {
}
