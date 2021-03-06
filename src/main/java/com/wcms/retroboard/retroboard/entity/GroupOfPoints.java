package com.wcms.retroboard.retroboard.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

public class GroupOfPoints {

    @JsonProperty
    private Long id;

    @JsonProperty
    private GroupType type;

    @JsonProperty
    private String sessionId;

    @JsonProperty
    private List<Point> pointList = new ArrayList<>();

    public GroupOfPoints(Long id, GroupType type) {
        this.id = id;
        this.type = type;
    }

    public GroupOfPoints(Long id, GroupType type, List<Point> pointList, String sessionId) {
        this.id = id;
        this.sessionId = sessionId;
        this.type = type;
        this.pointList.addAll(pointList);
    }

    public Long getId() {
        return id;
    }

    public GroupType getType() {
        return type;
    }

    public String getSessionId() {
        return sessionId;
    }

    public List<Point> getPointList() {
        return pointList;
    }

    public void addPoint(Point point) {
        pointList.add(point);
    }



}


