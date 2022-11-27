export const ProductObj = {
  coBan: {
    hinhAnh: [],
    ten: "",
    gia: 0,
    giamGia: 0,
    nhuCau: "",
    tinhNang: "",
  },
  thongTin: {
    p_n: "",
    xuatXu: "",
    thuongHieu: "",
    thoiGianBaoHanh: 0,
    thoiDiemRaMat: 0,
    huongDanSuDung: "",
    huongDanBaoQuan: "",
  },
  thietKeTrongLuong: {
    kichThuoc: "",
    trongLuongSanPham: "",
    chatLieu: "",
  },
  boXuLy: {
    cpu: "",
    loaiCPU: "",
    tocDoCPU: "",
    tocDoToiDaCPU: "",
    soNhan: 0,
    soLuong: 0,
    boNhoDem: "",
  },
  RAM: {
    ram: "",
    chuThichRAM: "",
    loaiRAM: "",
    tocDoRAM: "",
    soKheCamRoi: 0,
    soRAMConLai: 0,
    soRAMOnboard: 0,
    hoTroRAMToiDa: "",
  },
  manHinh: {
    kichThuocManHinh: "",
    congNgheManHinh: "",
    doPhanGiai: "",
    loaiManHinh: "",
    tanSoQuet: "",
    tamNen: "",
    doPhuMau: "",
    tyLeManHinh: "",
    manHinhCamUng: "",
  },
  doHoa: {
    cardOnboard: {
      hang: "",
      model: "",
    },
    cardRoi: {
      hang: "",
      model: "",
      boNho: "",
    },
  },
  luuTru: {
    oCung: "",
    loaiOCung: "",
    tongSoKheCamSSDHDD: 0,
    soKheSSDHDDConLai: "",
    SSDHDD: "", // ???
  },
  giaoTiepKetNoi: {
    congGiaoTiep: "",
    wifi: "",
    bluetooth: "",
    webcam: "",
  },
  amThanh: {
    congNgheAmThanh: "",
  },
  banPhimTouchPad: {
    kieuBanPhim: "",
    banPhimSo: "",
    denBanPhim: "",
    congNgheDenBanPhim: "",
  },
  thongTinPinSac: {
    loaiPin: "",
    powerSupply: "",
    dungLuongPin: "",
  },
  heDieuHanh: {
    os: "",
    version: "",
    phanMemKhac: "",
  },
};

export const ProductLabel = [
  {
    // 0
    base: "Cơ bản",
    child: [
      "Hình ảnh",
      "Tên sản phẩm",
      "Giá sản phẩm",
      "Giảm giá (%)",
      "Nhu cầu sử dụng",
      "Tính năng đặc biệt",
    ],
  },
  {
    // 1
    base: "Thông tin",
    child: [
      "P/N",
      "Xuất xứ",
      "Thương hiệu",
      "Thời gian bảo hành (tháng)",
      "Thời gian ra mắt",
      "Hướng dẫn sử dụng",
      "Hướng dẫn bảo quản",
    ],
  },
  {
    // 2
    base: "Thiết kế và trọng lượng",
    child: ["Kích thước", "Trọng lượng sản phẩm", "Chất liệu"],
  },
  {
    // 3
    base: "Bộ xử lý",
    child: [
      "CPU",
      "Loại CPU",
      "Tốc độ CPU",
      "Tốc độ tối đa",
      "Số nhân",
      "Số luồng",
      "Bộ nhớ đệm",
    ],
  },
  {
    // 4
    base: "RAM",
    child: [
      "Dung lượng RAM",
      "Chú thích RAM",
      "Loại RAM",
      "Tốc độ RAM",
      "Số khe cắm rời",
      "Số RAM còn lại",
      "Số RAM onboard",
      "Hỗ trợ RAM tối đa",
    ],
  },
  {
    // 5
    base: "Màn hình",
    child: [
      "Kích thước tối đa",
      "Công nghệ màn hình",
      "Độ phân giải",
      "Loại màn hình",
      "Tần số quét",
      "Tấm nền",
      "Độ phủ màu",
      "Tỷ lệ màn hình",
      "Màn hình cảm ứng",
    ],
  },
  {
    // 6
    base: "Đồ họa",
    child: [
      {
        deep: "Card Onboard",
        children: ["Hãng", "Model"],
      },
      {
        deep: "Card rời",
        children: ["Hãng", "Model", "Bộ nhớ"],
      },
    ], // ???
  },
  {
    // 7
    base: "Lưu trữ",
    child: [
      "Ổ cứng",
      "Loại ổ cứng",
      "Tổng số khe cắm SSD/HDD",
      "Số khe SSD/HDD",
      "SSD/HDD", // ???
    ],
  },
  {
    // 8
    base: "Giao tiếp và kết nối",
    child: ["Cổng giao tiếp", "Wifi", "Bluetooth", "Webcam"],
  },
  {
    // 9
    base: "Âm thanh",
    child: ["Công nghệ âm thanh"],
  },
  {
    // 10
    base: "Bàn phím và Touch Pad",
    child: [
      "Kiểu bàn phím",
      "Bàn phím số",
      "Đèn bàn phím",
      "Công nghệ đèn bàn phím",
    ],
  },
  {
    // 11
    base: "Thông tin pin và sạc",
    child: ["Loại pin", "Power Supply", "Dung lượng pin"],
  },
  {
    // 12
    base: "Hệ điều hành",
    child: ["OS", "Version", "Phần mềm khác"],
  },
];
