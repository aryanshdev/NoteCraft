package example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.io.*;
import java.nio.file.*;
import java.util.*;

public class JavaCodeRunner implements RequestHandler<Map<String, Object>, Map<String, Object>> {

    @Override
    public Map<String, Object> handleRequest(Map<String, Object> event, Context context) {
        String code = "";
        Map<String, Object> response = new HashMap<>();
        String output = "";
        String status = "success";

        try {
            if (event.containsKey("body")) {
                String body = (String) event.get("body");
                code = new com.fasterxml.jackson.databind.ObjectMapper().readTree(body).get("code").asText();
            }

            String uuid = UUID.randomUUID().toString().replace("-", "");
            Path javaFile = Paths.get("/tmp/" + uuid + ".java");
            Path classFile = Paths.get("/tmp/" + uuid + ".class");
            String className = uuid;

            String wrappedCode = "public class " + className + " {\n" + code + "\n}";

            Files.write(javaFile, wrappedCode.getBytes());

            Process compile = new ProcessBuilder("javac", javaFile.toString())
                    .redirectErrorStream(true).start();
            String compileOut = new String(compile.getInputStream().readAllBytes());
            compile.waitFor();

            if (compile.exitValue() != 0) {
                status = "error";
                output = "Compilation failed:\n" + compileOut;
            } else {
                Process run = new ProcessBuilder("java", "-cp", "/tmp", className)
                        .redirectErrorStream(true).start();
                output = new String(run.getInputStream().readAllBytes());
                run.waitFor();
                if (run.exitValue() != 0) status = "error";
            }

            Files.deleteIfExists(javaFile);
            Files.deleteIfExists(classFile);

        } catch (Exception e) {
            status = "error";
            output = "Error: " + e.getMessage();
        }

        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");
        headers.put("Access-Control-Allow-Methods", "OPTIONS, POST");
        headers.put("Access-Control-Allow-Headers", "Content-Type");

        response.put("statusCode", 200);
        response.put("headers", headers);
        response.put("body", String.format("{\"status\":\"%s\", \"output\":%s}", status, jsonEscape(output)));
        return response;
    }

    private String jsonEscape(String s) {
        return "\"" + s.replace("\\", "\\\\")
                       .replace("\"", "\\\"")
                       .replace("\n", "\\n")
                       .replace("\r", "\\r") + "\"";
    }
}
