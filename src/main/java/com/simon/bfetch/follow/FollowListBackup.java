package com.simon.bfetch.follow;

import org.apache.commons.io.FileUtils;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.boot.CommandLineRunner;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
public class FollowListBackup  {
// https://blog.csdn.net/siguchou/article/details/107107944
//    java.lang.RuntimeException: org.jsoup.UnsupportedMimeTypeException: Unhandled content type. Must be text/*, application/xml, or application/*+xml. Mimetype=application/json; charset=utf-8, URL=https://api.bilibili.com/x/relation/followings?vmid=398915273&pn=1&ps=50&order=desc&order_type=attention&jsonp=jsonp&callback=__jp26
    public static void main(String[] args) throws IOException, InterruptedException {
        int maxPageNum = 807 / 50 +1;
        for (int pageNum = 1; pageNum < maxPageNum; pageNum++) {
            String res = queryByTemplate(pageNum);
            String filename = "json/follow_list/followList_page_" + pageNum+".json";
            FileUtils.writeStringToFile(new File(filename), res, "utf-8");
            System.out.println("第"+pageNum+"页成功保存");
            Thread.sleep((long)(1000 * Math.random()));

        }
    }



    private static String queryByJsoup(int pageNum) {
        Connection connect = Jsoup.connect("https://api.bilibili.com/x/relation/followings?vmid=398915273&pn=" + pageNum + "&ps=50&order=desc&order_type=attention&jsonp=jsonp&callback=__jp26");
        connect.header("cookie", cookie);
        connect.header("Accept", "*/*");
        connect.header("Content-Type", "application/json");
        connect.header("referer", "https://space.bilibili.com/398915273/fans/follow?tagid=-2");
        Document document = null;
        try {
            document = connect.get();
        } catch (IOException e) {
            System.out.println("请求失败");
            throw new RuntimeException(e);
        }
        String res = document.toString();
        return res;
    }


    private static RestTemplate restTemplate = new  RestTemplate();// 需要单独初始化

    //Exception in thread "main" java.lang.NullPointerException: Cannot invoke "org.springframework.web.client.RestTemplate.exchange(String, org.springframework.http.HttpMethod, org.springframework.http.HttpEntity, java.lang.Class, Object[])" because "com.simon.bfetch.follow.FollowListBackup.restTemplate" is null
    private static String queryByTemplate(int pageNum) {
        String url = "https://api.bilibili.com/x/relation/followings?vmid=398915273&pn=" + pageNum + "&ps=50&order=desc&order_type=attention&jsonp=jsonp&callback=__jp26";
        HttpHeaders headers =  new HttpHeaders();
        headers.set("cookie", cookie);
        headers.set("referer", "https://space.bilibili.com/398915273/fans/follow?tagid=-2");
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        HttpEntity<HttpHeaders> entity = new HttpEntity<>(headers);
        ResponseEntity<String> resp = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return resp.toString();
        // https://blog.csdn.net/u011974797/article/details/125738366
        //https://blog.csdn.net/weixin_42943586/article/details/109056303
    }

    static String cookie="buvid3=0402B03B-A679-24BD-6539-4C9110D7BC5E31079infoc; _uuid=41510A2610-AD29-B5D10-E13F-110688E7F1EED31695infoc; buvid4=B3878A83-44B2-349C-8B20-FC9DE1B3232532267-022052223-CqihqonbP5rig5t1VeMe9w==; CURRENT_BLACKGAP=0; nostalgia_conf=-1; blackside_state=0; buvid_fp_plain=undefined; DedeUserID=398915273; DedeUserID__ckMd5=7212fa07666ab7eb; hit-dyn-v2=1; b_ut=5; LIVE_BUVID=AUTO7316536659970541; b_timer={\"ffp\":{\"333.1007.fp.risk_0402B03B\":\"1824D26FA02\",\"333.337.fp.risk_0402B03B\":\"181E39BC4E3\",\"333.788.fp.risk_0402B03B\":\"1824D27160B\",\"333.42.fp.risk_0402B03B\":\"180ECA54704\",\"333.866.fp.risk_0402B03B\":\"180ECA5725B\",\"444.41.fp.risk_0402B03B\":\"182081E125E\",\"666.4.fp.risk_0402B03B\":\"180ECADCB85\",\"666.25.fp.risk_0402B03B\":\"180ECADF352\",\"333.999.fp.risk_0402B03B\":\"182081DFD5C\",\"333.976.fp.risk_0402B03B\":\"18234B54D12\",\"333.885.fp.risk_0402B03B\":\"180F17DD699\",\"444.42.fp.risk_0402B03B\":\"181063C154A\",\"444.7.fp.risk_0402B03B\":\"181067E0F75\",\"888.66561.fp.risk_0402B03B\":\"181067E4277\",\"888.2869.fp.risk_0402B03B\":\"181067E47B9\",\"444.8.fp.risk_0402B03B\":\"1812F26B7E9\",\"333.46.fp.risk_0402B03B\":\"181E1D071F0\"}}; b_nut=100; i-wanna-go-feeds=-1; i-wanna-go-back=2; fingerprint3=3b2bab147a1be481290b7d86a8dad011; rpdid=|(JYYJkJkR))0J'uYY)~)kYR|; hit-new-style-dyn=0; fingerprint=574ecc14ade72670018f595b90196398; CURRENT_PID=866ebe00-b773-11ed-b060-53abb03349b1; CURRENT_FNVAL=16; share_source_origin=copy_web; bsource=share_source_copylink_web; PVID=2; buvid_fp=574ecc14ade72670018f595b90196398; SESSDATA=e3261fd3,1694011373,a7909*32; bili_jct=c0e5fc0eb928daa183530b2ddf7595ef; sid=5pw9n6di; CURRENT_QUALITY=120; bp_video_offset_398915273=771469993104638100; b_lsid=A542CA26_186CF6CBC86; innersign=1";
}
