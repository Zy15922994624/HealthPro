// 营养计算相关工具函数

// 根据食物和重量计算营养成分
export const calculateNutrition = (food, weight) => {
    if (!food || !weight) return null
    
    const ratio = Number(weight) / 100
    return {
        calories: food.calories * ratio,
        protein: food.protein * ratio,
        fat: food.fat * ratio,
        carbohydrate: food.carbohydrate * ratio
    }
}

// 表单验证
export const validateDietForm = (formData) => {
    return formData.foodId && 
           formData.foodWeight && 
           formData.foodWeight > 0
}

// 重置表单数据
export const getInitialFormData = () => ({
    mealType: '',
    foodId: '',
    foodName: '',
    foodWeight: '',
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrate: 0,
    mealTime: '',
    remark: ''
})

// 获取餐次状态
export const getMealStatus = (type, dietList) => {
    const records = dietList.filter(item => {
        const today = new Date().toISOString().split('T')[0]
        return item.mealTime.startsWith(today) && item.mealType === type
    })
    return records.length > 0 ? '已记录' : '未记录'
}

// 过滤食物列表
export const filterFoods = (foodList, searchKey) => {
    if (!searchKey) return []
    return foodList.filter(food =>
        food.name.toLowerCase().includes(searchKey.toLowerCase())
    )
}