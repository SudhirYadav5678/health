import { Service } from '../models/service.model.js'

const generateAccessAndRefereshTokens = async (serviceId) => {
    try {
        const service = await Service.findById(serviceId)
        const accessToken = service.generateAccessToken()
        const refreshToken = service.generateRefreshToken()
        service.refreshToken = refreshToken
        await service.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while generating referesh and access token"
        })
    }
}

const serviceRegister = async function (req, res) {
    const { name, password, descripition, price } = await req.body
    //console.log(name, password, descripition, price);
    if (
        name & password & descripition & price
    ) {
        throw new Error(400, "All fields are required")
    }

    //existing check
    const existedService = await Service.findOne({ name });
    if (existedService) {
        throw new Error(409, "Service already exists")
    }

    const user = await Service.create({
        name, password, descripition, price
    })
    return res.status(201).json(
        {
            success: true,
            message: "Service Registered"
        }
    )
}

const logInService = async function (req, res) {
    try {
        const { name, password } = req.body
        //console.log(name, password);
        const service = await Service.findOne({ name })
        //console.log(service);
        if (!service) {
            return res.status(409).json(
                {
                    success: false,
                    message: "service does not exist"
                }
            )
        }
        const correctPassword = await service.isPasswordCorrect(password)
        //console.log(correctPassword);

        if (!correctPassword) {
            return res.status(409).json(
                {
                    success: false,
                    message: "Password is incorrect"
                }
            )
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(service._id)
        //console.log(accessToken, refreshToken);

        const loggedInService = await Service.findById(service._id).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                {
                    service: loggedInService, accessToken, refreshToken,
                    success: true,
                    message: "Service provider login"
                }
            )

    } catch (error) {
        res.status(409).json(
            {
                success: false,
                message: "Service provider login fail"
            }
        )
    }

}

const logoutService = async (req, res) => {
    await Service.findByIdAndUpdate(
        req.service._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            success: true,
            message: "Logout"
        })
}

const getAllServicesId = async function (req, res) {
    const service = req.service._id
    console.log(service);

    if (!service) {
        return res.status(400).json({
            success: false,
            message: "Token not found"
        })
    }


    const serviceAll = await Service.find({ service: service._id }).exec()
    console.log(serviceAll);

    if (!serviceAll) {
        return res.status(400).json({
            success: false,
            message: "Error while access all your data"
        })
    }

    return res.status(200).json({
        success: true,
        message: "here your data",
        serviceAll,
        service
    })
}

const getAllServices = async function (req, res) {
    const service = req.service._id
    if (!service) {
        return res.status(400).json({
            success: false,
            message: "Token not found"
        })
    }


    const serviceAll = await Service.find().exec()
    if (!serviceAll) {
        return res.status(400).json({
            success: false,
            message: "Error while access all your data"
        })
    }

    return res.status(200).json({
        success: true,
        message: "here your data",
        serviceAll,
        service
    })
}

const updateService = async function (req, res) {
    const { name, password, descripition, price } = await req.body
    const serviceId = req.service; // middleware authentication
    console.log(serviceId);

    let service = await Service.findById(serviceId);
    if (!service) {
        return res.status(404).json({
            success: false,
            message: "service does not found"
        })
    }
    if (name) { service.name = name }
    if (password) { service.password = password }
    if (descripition) { service.descripition = descripition }
    if (price) { service.price = price }

    await service.updateOne({
        name: service.name,
        password: service.password,
        descripition: service.descripition,
        price: service.price,
    })
    return res.status(200).cookie("tokens", service.refreshToken).json({
        service: service.refreshToken,
        success: true,
        message: "Update successfully"
    })
}

const deleteService = async function (req, res) {
    const service = await Service.findById(req.service._id)
    //console.log(service);
    if (!service) {
        console.log("service  not found");
    }

    const deleteService = await service.deleteOne({ service: service._id })
    //console.log(deleteUser);

    return res.status(200).cookie("token", "").json({
        success: true,
        message: "Service deleted"
    })
}

export { serviceRegister, logInService, logoutService, getAllServices, updateService, deleteService, getAllServicesId }