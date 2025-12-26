// URL / 라우팅 용 (영문)
const PUBLIC = process.env.PUBLIC_URL;

export const CATEGORY_ORDER = {
    dog: [
        "feed",
        "snack",
        "toilet",
        "bath",
        "bowl",
        "house",
        "health",
        "clothes",
        "life",
        "toy",
        "carrier"
    ],
    cat: [
        "feed",
        "can",
        "snack",
        "litter",
        "toilet",
        "bath",
        "bowl",
        "house",
        "health",
        "clothes",
        "life",
        "toy",
        "carrier"
    ],
    small: [],
};

// 화면표시 / DB category (한글)
export const CATEGORY = {
    feed: {label: "사료", img: `${PUBLIC}/images/category/feed.png`},
    can: {label: "캔", img: `${PUBLIC}/images/category/can.png`},
    snack: {label: "간식", img: `${PUBLIC}/images/category/snack.png`},
    litter: {label: "모래", img: `${PUBLIC}/images/category/litter.png`},
    toilet: {label: "위생/화장실", img: `${PUBLIC}/images/category/toilet.png`},
    bath: {label: "미용/목욕", img: `${PUBLIC}/images/category/bath.png`},
    bowl: {label: "식기", img: `${PUBLIC}/images/category/bowl.png`},
    house: {label: "하우스/울타리", img: `${PUBLIC}/images/category/house.png`},
    health: {label: "건강관리", img: `${PUBLIC}/images/category/health.png`},
    clothes: {label: "의류", img: `${PUBLIC}/images/category/clothes.png`},
    life: {label: "실생활용품", img: `${PUBLIC}/images/category/life.png`},
    toy: {label: "장난감", img: `${PUBLIC}/images/category/toy.png`},
    carrier: {label: "이동장", img: `${PUBLIC}/images/category/carrier.png`}
};
