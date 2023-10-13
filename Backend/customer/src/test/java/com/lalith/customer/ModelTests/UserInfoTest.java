package com.lalith.customer.ModelTests;

import com.lalith.customer.model.UserInfo;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class UserInfoTest {

    @Test
    public void testUserInfoModel() {
        UserInfo userInfo = new UserInfo();
        userInfo.setId("1");
        userInfo.setName("John Doe");
        userInfo.setEmail("john@example.com");
        userInfo.setPassword("password");
        userInfo.setRoles("USER");

        assertEquals("1", userInfo.getId());
        assertEquals("John Doe", userInfo.getName());
        assertEquals("john@example.com", userInfo.getEmail());
        assertEquals("password", userInfo.getPassword());
        assertEquals("USER", userInfo.getRoles());
    }

    @Test
    public void testIdSetterGetter() {
        UserInfo userInfo = new UserInfo();
        userInfo.setId("2");
        assertEquals("2", userInfo.getId());
    }

    @Test
    public void testNameSetterGetter() {
        UserInfo userInfo = new UserInfo();
        userInfo.setName("Jane Smith");
        assertEquals("Jane Smith", userInfo.getName());
    }

    @Test
    public void testEmailSetterGetter() {
        UserInfo userInfo = new UserInfo();
        userInfo.setEmail("jane@example.com");
        assertEquals("jane@example.com", userInfo.getEmail());
    }

    @Test
    public void testPasswordSetterGetter() {
        UserInfo userInfo = new UserInfo();
        userInfo.setPassword("newpassword");
        assertEquals("newpassword", userInfo.getPassword());
    }

    @Test
    public void testRolesSetterGetter() {
        UserInfo userInfo = new UserInfo();
        userInfo.setRoles("ADMIN");
        assertEquals("ADMIN", userInfo.getRoles());
    }

    @Test
    public void testEqualsAndHashCode() {
        UserInfo userInfo1 = new UserInfo("1", "John Doe", "john@example.com", "password", "USER");
        UserInfo userInfo2 = new UserInfo("1", "John Doe", "john@example.com", "password", "USER");

        assertTrue(userInfo1.equals(userInfo2));
        assertTrue(userInfo2.equals(userInfo1));
        assertEquals(userInfo1.hashCode(), userInfo2.hashCode());
    }

    @Test
    public void testNotEquals() {
        UserInfo userInfo1 = new UserInfo("1", "John Doe", "john@example.com", "password", "USER");
        UserInfo userInfo2 = new UserInfo("2", "Jane Smith", "jane@example.com", "newpassword", "ADMIN");

        assertFalse(userInfo1.equals(userInfo2));
        assertFalse(userInfo2.equals(userInfo1));
    }

    @Test
    public void testToString() {
        UserInfo userInfo = new UserInfo("1", "John Doe", "john@example.com", "password", "USER");
        String expected = "UserInfo(id=1, name=John Doe, email=john@example.com, password=password, roles=USER)";
        assertEquals(expected, userInfo.toString());
    }
}
