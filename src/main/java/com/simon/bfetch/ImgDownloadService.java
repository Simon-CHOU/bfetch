package com.simon.bfetch;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@Service
public class ImgDownloadService {
    private RestTemplate restTemplate;
    private String cookieStr ="//TODO copy cookies from browser";

    public ImgDownloadService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();

    }

    public void getImg() throws InterruptedException {
        final String filePath = "C:\\Users\\simon\\Documents\\bilibili_up_pic_batch_fetch\\urls.csv";
        List<String> imgUrl = getUrlsFromCsv(filePath);
        imgUrl.remove(0);//delete csv table head
        for (String url : imgUrl) {
            System.out.println(url);
            String fileName = url.substring(url.lastIndexOf("/") + 1);
            System.out.println(fileName);
            HttpHeaders headers =  new HttpHeaders();
            headers.set("cookie", cookieStr);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_OCTET_STREAM));
            HttpEntity<HttpHeaders> entity = new HttpEntity<>(headers);
            ResponseEntity<byte[]> resp = restTemplate.exchange(url, HttpMethod.GET, entity, byte[].class);
            try {
                String resImgFilename = "C:\\Users\\simon\\Documents\\bilibili_up_pic_batch_fetch\\res_img_1852181\\" + fileName;
                Files.write(Paths.get(resImgFilename), Objects.requireNonNull(resp.getBody()));
            } catch (IOException e) {
                e.printStackTrace();
            }
            Thread.sleep((long)(Math.random()*5000));
//            File file = restTemplate.execute(url, HttpMethod.GET, null, clientHttpResponse -> {
////                File ret = File.createTempFile("download", "tmp");
//                File ret = new File("C:\\Users\\simon\\Documents\\bilibili_up_pic_batch_fetch\\" + fileName);
//                StreamUtils.copy(clientHttpResponse.getBody(), new FileOutputStream(ret));
//                return ret;
//            });

//            File file1 = restTemplate.exchange(url, HttpMethod.GET,entity , clientHttpResponse -> {
////                File ret = File.createTempFile("download", "tmp");
//                File ret = new File("C:\\Users\\simon\\Documents\\bilibili_up_pic_batch_fetch\\" + fileName);
//                StreamUtils.copy(clientHttpResponse.getBody(), new FileOutputStream(ret));
//                return ret;
//            });
        }


    }

    private List<String> getUrlsFromCsv(String filePath) {
        List<String> imgUrl = new ArrayList<>();
        try {
            Scanner sc = new Scanner(new File(filePath));
//            sc.useDelimiter("\n");
            sc.useDelimiter("\r\n");
//            sc.useDelimiter(",");
            while (sc.hasNext()) {
//                System.out.println(sc.next());
                imgUrl.add(sc.next());
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return imgUrl;
    }
}
