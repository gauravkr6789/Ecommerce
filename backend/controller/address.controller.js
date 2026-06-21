import Address from "../model/address.model.js";


export const createAddress =
async (req, res) => {
  try {

    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    if (isDefault) {

      await Address.updateMany(
        {
          user: req.user._id,
        },
        {
          isDefault: false,
        }
      );

    }

    const newAddress =
      await Address.create({
        user: req.user._id,
        fullName,
        phone,
        address,
        city,
        state,
        pincode,
        isDefault,
      });

    return res.status(201).json({
      success: true,
      message:
        "Address created successfully",
      data: newAddress,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });

  }
};


// Get User Addresses

export const getAddresses =
async (req, res) => {
  try {

    const addresses =
      await Address.find({
        user: req.user._id,
      }).sort({
        isDefault: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message:
        "Addresses fetched successfully",
      data: addresses,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });

  }
};


// Get Single Address

export const getAddressById =
async (req, res) => {
  try {

    const address =
      await Address.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!address) {

      return res.status(404).json({
        success: false,
        message:
          "Address not found",
        data: null,
      });

    }

    return res.status(200).json({
      success: true,
      message:
        "Address fetched successfully",
      data: address,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });

  }
};


// Update Address

export const updateAddress =
async (req, res) => {
  try {

    const {
      isDefault,
    } = req.body;

    if (isDefault) {

      await Address.updateMany(
        {
          user: req.user._id,
        },
        {
          isDefault: false,
        }
      );

    }

    const updatedAddress =
      await Address.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedAddress) {

      return res.status(404).json({
        success: false,
        message:
          "Address not found",
        data: null,
      });

    }

    return res.status(200).json({
      success: true,
      message:
        "Address updated successfully",
      data: updatedAddress,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });

  }
};


// Delete Address

export const deleteAddress =
async (req, res) => {
  try {

    const address =
      await Address.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!address) {

      return res.status(404).json({
        success: false,
        message:
          "Address not found",
        data: null,
      });

    }

    return res.status(200).json({
      success: true,
      message:
        "Address deleted successfully",
      data: null,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });

  }
};