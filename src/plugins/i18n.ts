import {createI18n} from "vue-i18n"

const messages = {
    vi: {
        login: 'Đăng nhập',
        logout: 'Đăng xuất',
        errorEmail: 'Email là bắt buộc',
        errorPassword: 'Mật khẩu là bắt buộc',
        welcome: 'Tham gia một cuộc hội thoại',
        newRoom: 'Tạo phòng mới',
        enterRoomID: 'Hoặc nhập ID phòng',

        class: 'Phòng Học',
        offedCamera: 'Bạn đã tắt camera',
        term: 'Việc làm gia cuộc gọi sẽ coi như bạn sẽ đồng ý với các điều khoản và chính sách của chúng tôi.',
        join: 'Tham gia',
        cancel: 'Hủy',

        member: 'Thành viên',
        sendRandomInvitation: 'Mời Ngẫu Nhiên',
        search: 'Tìm kiếm...',
        invite: 'Mời',

        chat: 'Trò chuyện',
        send: 'Gửi',
        writeMessage: 'Nhập tin nhắn...',

        listClassMates: 'Danh sách lớp',
        onlyClassmatesOnline: 'Chỉ hiển thị bạn bè đang online',

        setting: 'Cài Đặt Phòng',
        displayMode: 'Chế độ hiển thị',
        scroll: 'Cuộn',
        grid: 'Lưới',

        languages: 'Ngôn ngữ',
    },
    jp: {
        login: 'XXXX',
        logout: 'XXXXX',
        errorEmail: 'Email XXXX XXXX',
        errorPassword: 'XXXX XXXX',
        welcome: 'XXXX XXXX',
        newRoom: 'XXXX XXXX',
        enterRoomID: 'XXXX XXXX',

        class: 'XXXX XXXX',
        offedCamera: 'XXXX XXXX',
        term: 'XXXX XXXXXXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX',
        join: 'XXXX XXXX',
        cancel: 'XXXX',

        member: 'XXXX XXXX',
        sendRandomInvitation: 'XXXX XXXX XXXX',
        search: 'XXXX XXXX...',
        invite: 'XXXX',

        chat: 'XXXX XXXX',
        send: 'XXX',
        writeMessage: 'XXXX XXXX XXXX...',

        listClassMates: 'XXXX XXXX XXXX',
        onlyClassmatesOnline: 'XXXX XXXX XXXX XXXX XXXX XXXX',

        setting: 'XXXX XXXX XXX',
        displayMode: 'XXXX XXXX XXXX',
        scroll: 'XXXX',
        grid: 'XXXX',

        languages: 'XXXX XXXX',
    }
}

export const i18n = createI18n({
    fallbackLocale: 'vi',
    locale: 'vi',
    // something vue-i18n options here ...
    messages
})
