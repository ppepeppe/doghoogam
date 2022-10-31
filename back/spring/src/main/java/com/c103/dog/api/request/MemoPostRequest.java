package com.c103.dog.api.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@ApiModel(value = "MemoPostRequest",description = "메모 등록 요청")
public class MemoPostRequest {

    @ApiModelProperty(name="dogPk", example="1" , dataType = "강아지 PK")
    private int dogPk;

    private String title;

    private String content;

    @ApiModelProperty(name="메모 저장 날짜", example="yyyy-MM-dd HH:mm" , value = "year와 month,date로 분리해서 바꿔줄수 있음")
    @JsonFormat(timezone = "Asia/Seoul", pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime memoDate;
}