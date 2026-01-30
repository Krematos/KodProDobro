package com.kodprodobro.kodprodobro.repositories.project;


import com.kodprodobro.kodprodobro.models.project.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByPublishedTrue();

    List<Project> findByTitleContainingIgnoreCaseAndPublishedTrue(String title);
}
