package com.example.ktws.schedule;

import com.example.ktws.domain.Course;
import com.example.ktws.domain.Section;
import com.example.ktws.mq.RequestSender;
import com.example.ktws.service.CourseService;
import com.example.ktws.service.SectionService;
import com.example.ktws.util.RequestMsg;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.Optional;

@Component
public class SendMsgJob implements Job {
    @Autowired
    private RequestSender requestSender;

    @Autowired
    private SectionService sectionService;

    @Autowired
    private CourseService courseService;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        logger.info("Sending...");
        JobDataMap data = jobExecutionContext.getMergedJobDataMap();
        Long courseId = (Long) data.get("courseId");
        String camera = (String) data.get("camera");
        Integer interval = (Integer) data.get("interval");
        Integer duration = (Integer) data.get("duration");
        System.out.println("courseId: " + String.valueOf(courseId));
        System.out.println("camera: " + camera);
        System.out.println("interval: " + String.valueOf(interval));
        System.out.println("duration: " + String.valueOf(duration));
        RequestMsg msg = new RequestMsg();
        Optional<Course> c = courseService.findById(courseId);
        if (!c.isPresent()) {
            logger.error("ERROR: No such course with cid {}" , courseId);
            return;
        }
        Course course = c.get();
        Section section = sectionService.addNewSection(new Timestamp(System.currentTimeMillis()), course);

        msg.setSectionId(section.getId());
        msg.setCamera(camera);
        msg.setInterval(interval);
        msg.setDuration(duration);
        requestSender.send(msg, "requestQueue");
        logger.info("Successfully send a message with cid {} sid {} to requestQueue", courseId, section.getId());
    }
}
