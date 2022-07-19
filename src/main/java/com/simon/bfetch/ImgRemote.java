package com.simon.bfetch;

import feign.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient("Image")
public interface ImgRemote {

    @GetMapping
    Response downloadFile();
}
