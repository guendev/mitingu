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

        online: 'Online',

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
        login: 'ログイン',
        logout: 'ログアウト',
        errorEmail: 'メールを確認してください！',
        errorPassword: 'パスワードを確認してください！',
        welcome: 'ようこそ！',
        newRoom: 'ルームを始める',
        enterRoomID: 'ルームIDを入力',

        class: 'クラス',
        offedCamera: 'カメラがオフ！',
        term: 'タームズ',
        join: '参加',
        cancel: 'キャンセル',

        online: 'Online',

        member: 'メンバー',
        sendRandomInvitation: 'クラスメートを誘う',
        search: '探す',
        invite: '誘う',

        chat: 'チャット',
        send: '送る',
        writeMessage: '書く',

        listClassMates: 'クラスメートリスト',
        onlyClassmatesOnline: 'オンラインのリスト',

        setting: '設定',
        displayMode: 'デイスプレー',
        scroll: 'スクロール',
        grid: 'グリッド',

        languages: '言語',
    }
}

export const i18n = createI18n({
    fallbackLocale: 'vi',
    locale: 'vi',
    // something vue-i18n options here ...
    messages
})
