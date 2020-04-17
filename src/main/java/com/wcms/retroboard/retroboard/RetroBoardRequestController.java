package com.wcms.retroboard.retroboard;

import com.wcms.retroboard.retroboard.entity.GroupOfPoints;
import com.wcms.retroboard.retroboard.entity.GroupType;
import com.wcms.retroboard.retroboard.entity.Point;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import static com.wcms.retroboard.retroboard.RetroBoardApplication.groupOfPointsList;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/retro")
public class RetroBoardRequestController {
    Random random = new Random();

    @RequestMapping(path = "/add",
            method = RequestMethod.POST,
            produces = "application/json")
    Point add(@RequestParam(required = false) Long groupId, @RequestParam String message, @RequestParam String type, @RequestParam String sessionId) {

        //TODO move this logic to DAO
        if(sessionId != null) {
            System.out.println("Our SESSION ID is present" + sessionId);
            Optional<GroupOfPoints> first = groupOfPointsList.stream().filter(groupOfPoints -> groupOfPoints.getSessionId().equals(sessionId)).findFirst();
            
            if(first.isPresent()) {
                GroupOfPoints groupOfPoints = first.get();
                Point point = new Point(random.nextLong(), message, sessionId);
                groupOfPoints.addPoint(point);
                return point;
            } else {
                throw new IllegalArgumentException("could not find group by provided ID or Session ID");
            }
        } else {
            GroupOfPoints groupOfPoints = new GroupOfPoints(random.nextLong(), GroupType.fromString(type));
            Point point = new Point(random.nextLong(), message, sessionId);
            groupOfPoints.addPoint(point);
            groupOfPointsList.add(groupOfPoints);
            return point;
        }
    }

    @RequestMapping(path = "/list",
            method = RequestMethod.GET,
            produces = "application/json")
            List<GroupOfPoints> list(@RequestParam(required = false) String type, @RequestParam(required = false) String sessionId) {

        if(type != null) {
            GroupType groupType = GroupType.fromString(type);
            if(groupType == null) {
                //throw error
                throw new IllegalArgumentException("could not find specified group type");
            } else {
                return groupOfPointsList.stream().filter(groupOfPoints -> groupOfPoints.getType().equals(groupType)).collect(Collectors.toList());
            }
        }
        if(sessionId != null) {
            try {
                return groupOfPointsList.stream().filter(groupOfPoints -> groupOfPoints.getSessionId().equals(sessionId)).collect(Collectors.toList());
            } catch (NullPointerException err) {
                System.out.println(err);
            }
        }
        
        return groupOfPointsList;
    }

    @RequestMapping(path = "/voteup",
            method = RequestMethod.POST,
            produces = "application/json")
    Point voteUp(@RequestParam Long id, @RequestParam String username) {
        Optional<Point> first = groupOfPointsList.stream().map(GroupOfPoints::getPointList).flatMap(Collection::stream).filter(point -> point.getId().equals(id)).findFirst();
        if (first.isPresent()) {
            Point point = first.get();
            point.voteUp(username);
            return point;
        }
        throw new IllegalArgumentException("could not find point with specified id");
    }

    @RequestMapping(path = "/votedown",
            method = RequestMethod.POST,
            produces = "application/json")
    Point voteDown(@RequestParam Long id, @RequestParam String username) {
        Optional<Point> first = groupOfPointsList.stream().map(GroupOfPoints::getPointList).flatMap(Collection::stream).filter(point -> point.getId().equals(id)).findFirst();
        if (first.isPresent()) {
            Point point = first.get();
            point.voteDown(username);
            return point;
        }
        throw new IllegalArgumentException("could not find point with specified id");
    }

    @RequestMapping(path = "/group",
            method = RequestMethod.POST,
            produces = "application/json")
    Point group(@RequestParam Long pointId, @RequestParam String groupId) {
        //TODO think through whole idea of Point - GroupOfPoints, to avoid pitfalls like this :D
        throw new UnsupportedOperationException();
    }



}
