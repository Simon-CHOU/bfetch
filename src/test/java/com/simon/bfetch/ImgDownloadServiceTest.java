package com.simon.bfetch;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.graphql.tester.AutoConfigureGraphQlTester;
import org.springframework.boot.test.context.SpringBootTest;

import javax.xml.bind.SchemaOutputResolver;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ImgDownloadServiceTest {
    @Autowired
    ImgDownloadService service;

    @Test
    void getImg() throws InterruptedException {
        service.getImg();
    }
    @Test
    void getFileNameFromCdnUrl(){
        final String urlDemo = "https://i0.hdslb.com/bfs/album/6b7d020a30c99f9e16fe51f4578df0369f1c81f4.jpg";
        String fileNameStr = urlDemo.substring(urlDemo.lastIndexOf("/") + 1);
        System.out.println(fileNameStr);
        assertEquals("6b7d020a30c99f9e16fe51f4578df0369f1c81f4.jpg", fileNameStr);
    }
}