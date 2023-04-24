const express = require("express");
const UserCollection = require("../Models/User");
const JobsCollection = require("../Models/Jobs");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const fetchjobs = require("../middleware/fetchjobs");
const Dayplaner = require("../Models/Dayplaner");

const JWT_SECRET = "qwertyuiop";

// user Signup
//Route 1
router.post(
  "/usersignup",
  [
    body("name", "Enter a valid name").isLength({ min: 1 }),
    body("password").isLength({ min: 2 }),
    body("email", "Enter a valid email").isEmail(),
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ sucess: sucess, errors: errors.array() });
    }

    //check email already exist or not
    try {
      let user = await UserCollection.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          sucess: false,
          error: "sorry a user with this email already exist",
        });
      }
      const salt = await bcrypt.genSalt(10);
      secpass = await bcrypt.hash(req.body.password, salt);

      //create ney user
      user = await UserCollection.create({
        name: req.body.name,
        password: secpass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      console.log(authtoken);
      sucess = true;
      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//uthenticate a user "./api/auth/login"
//ROUte 2
router.post(
  "/userlogin",
  [
    body("password", "password cannot be blank").exists(),
    body("email", "Enter a valid email").isEmail(),
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await UserCollection.findOne({ email });
      if (!user) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "enter correct login credentials" });
      }
      const passcompare = await bcrypt.compare(password, user.password);
      if (!passcompare) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "enter correct login credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      // console.log(authtoken)
      sucess = true;

      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error occured");
    }
  }
);

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserCollection.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error occured");
  }
});

router.post(
  "/addjob",
  [
    body("company", "Enter a valid comapny"),
    body("role", "enter a valid role"),
    body("ctc", "enter a valid ctc"),
    body("jobid", "enter a valid jobid"),
    body("joblink", "enter a valid joblink"),
    body("applied"),
    body("noresponse"),
    body("rejected"),
    body("interview"),
    body("selected"),
    body("id"),
  ],

  async (req, res) => {
    try {
      const {
        company,
        role,
        ctc,
        applied,
        rejected,
        interview,
        noresponse,
        selected,
        jobid,
        joblink,
      } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
      const calender = date + "-" + month + "-" + year;
      const job = await new JobsCollection({
        company: company,
        role: role,
        ctc: ctc,
        user: req.body.id,
        applied: applied,
        rejected: rejected,
        selected: selected,
        noresponse: noresponse,
        interview: interview,
        joblink: joblink,
        jobid: jobid,
        date: calender,
      });

      const savejob = await job.save();

      res.json(savejob);
      console.log(savejob);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some  error occured");
    }
  }
);

router.post("/fetchalljobs", [body("id")], async (req, res) => {
  try {
    const jobs = await JobsCollection.find({ user: req.body.id });
    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});

router.post("/fetchapplied", [body("id")], async (req, res) => {
  try {
    const jobs = await JobsCollection.find({
      user: req.body.id,
      applied: true,
    });
    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});
router.post("/fetchnoresponse", [body("id")], async (req, res) => {
  try {
    const jobs = await JobsCollection.find({
      user: req.body.id,
      noresponse: true,
    });
    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});
router.post("/fetchinterview", [body("id")], async (req, res) => {
  try {
    const jobs = await JobsCollection.find({
      user: req.body.id,
      interview: true,
    });
    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});
router.post("/fetchrejected", [body("id")], async (req, res) => {
  try {
    const jobs = await JobsCollection.find({
      user: req.body.id,
      rejected: true,
    });
    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});
router.post("/fetchselected", [body("id")], async (req, res) => {
  try {
    const jobs = await JobsCollection.find({
      user: req.body.id,
      selected: true,
    });
    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});

router.put(
  "/updatejob/:id",
  [
    body("company", "Enter a valid comapny"),
    body("role", "enter a valid role"),
    body("ctc", "enter a valid ctc"),
    body("jobid", "enter a valid jobid"),
    body("joblink", "enter a valid joblink"),
    body("applied"),
    body("noresponse"),
    body("rejected"),
    body("interview"),
    body("selected"),
    body("id"),
  ],

  async (req, res) => {
    try {
      const {
        company,
        role,
        ctc,
        applied,
        rejected,
        interview,
        noresponse,
        selected,
        jobid,
        joblink,
      } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
      const calender = date + "-" + month + "-" + year;

      // const newjob = {};
      // if (company) {
      //   newjob.company = company;
      // }
      // if (role) {
      //   newjob.role = role;
      // }
      // if (ctc) {
      //   newjob.ctc = ctc;
      // }
      // if (joblink) {
      //   newjob.joblink = joblink;
      // }
      // if (jobid) {
      //   newjob.jobid = jobid;
      // }
      // if (applied) {
      //   newjob.applied = applied;
      // }
      // if (rejected) {
      //   newjob.rejected = rejected;
      // }
      // if (selected) {
      //   newjob.selected = selected;
      // }
      // if (noresponse) {
      //   newjob.noresponse = noresponse;
      // }
      // if (interview) {
      //   newjob.interview = interview;
      // }

      let job = await JobsCollection.findById(req.params.id);
      if (!job) {
        return res.status(404).send("Not Found");
      }

      let updatedjob = await JobsCollection.findByIdAndUpdate(req.params.id, {
        company: company,
        role: role,
        ctc: ctc,
        jobid: jobid,
        joblink: joblink,
        applied: applied,
        rejected: rejected,
        noresponse: noresponse,
        interview: interview,
        selected: selected,
      });

      res.json(updatedjob);
      console.log(updatedjob);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some  error occured");
    }
  }
);

router.delete("/deletejob/:id", async (req, res) => {
  try {
    let job = await JobsCollection.findById(req.params.id);
    if (!job) {
      res.status(404).send("not found");
    }

    job = await JobsCollection.findByIdAndDelete(req.params.id);
    res.json({ sucess: "note has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some  error occured");
  }
});

router.post(
  "/dayplanar",
  [
    body("a56"),
    body("a67"),
    body("a78"),
    body("a78"),
    body("a89"),
    body("a910"),
    body("a1011"),
    body("a1112"),
    body("p121"),
    body("p12"),
    body("p23"),
    body("p34"),
    body("p45"),
    body("p56"),
    body("p67"),
    body("p78"),
    body("p89"),
    body("p910"),
    body("p1011"),
    body("p115"),
    body("userid"),
  ],

  async (req, res) => {
    try {
      const {
        a56,
        a67,
        a78,
        a89,
        a910,
        a1011,
        a1112,
        p12,
        p23,
        p34,
        p45,
        p56,
        p67,
        p78,
        p89,
        p910,
        p1011,
        p115,
      } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      await Dayplaner.deleteMany({ user: req.body.userid });
      const dayplan = await new Dayplaner({
        user: req.body.userid,
        a56: a56,
        a67: a67,
        a78: a78,
        a89: a89,
        a910: a910,
        a1011: a1011,
        a1112: a1112,
        p12: p12,
        p23: p23,
        p34: p34,
        p45: p45,
        p56: p56,
        p67: p67,
        p78: p78,
        p89: p89,
        p910: p910,
        p1011: p1011,
        p115: p115,
      });

      const savedayplan = await dayplan.save();

      res.json("savedayplan");
      console.log("deleted sucess");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some  error occured");
    }
  }
);


router.post("/fetchplan", fetchuser, async (req, res) => {
  try {
    const plan = await Dayplaner.find({ user: req.user.id });
    console.log(plan)
    res.json(plan);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});

module.exports = router;
