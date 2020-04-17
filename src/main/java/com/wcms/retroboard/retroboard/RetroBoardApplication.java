package com.wcms.retroboard.retroboard;

import com.wcms.retroboard.retroboard.entity.GroupOfPoints;
import com.wcms.retroboard.retroboard.entity.GroupType;
import com.wcms.retroboard.retroboard.entity.Point;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Simple Spring application for our Retro board project
 *
 * Current version is purely POC, so that frontend could get some mock data
 *
 * Things to-do:
 * 1) Introduce some self-contained database
 * 2) Create DAOs for easier use
 * 3) Introduce some kind of history?
 */
@SpringBootApplication
public class RetroBoardApplication {

	//Keeping content in memory
	//TODO replace with DB
	public static List<GroupOfPoints> groupOfPointsList = new ArrayList<>();

	public static void main(String[] args) {

		groupOfPointsList.addAll(Arrays.asList(
			new GroupOfPoints(1L, GroupType.POSITIVE, Arrays.asList(
				new Point(1L,"positive point 1", "retro#1"), 
				new Point(2L, "positive point 2",  "retro#1"))
			),
			new GroupOfPoints(3L, GroupType.NEGATIVE, Arrays.asList(
				new Point(3L,"Negative point 1",  "retro#1"), 
				new Point(4L,"Negative point 2",  "retro#1"))
				)
				)
				);

		SpringApplication.run(RetroBoardApplication.class, args);
	}

}
