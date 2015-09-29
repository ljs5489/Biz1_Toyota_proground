<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="UTF-8"%>
<button type="button" class="list" id="btn_menu">
	<img src="../images/btn/list.png">
</button>
<div class="menu_pop">
	<ul id="menuContent">
		<li class="menu01 btn_menu" value="1">
			<button onclick="location.href='estimate.jsp'">
				<img src="../images/btn/menu1.png"><span>견적생성</span>
			</button>
		</li>
		<li class="menu02 btn_menu" value="2">
			<button onclick="location.href='estimateView.jsp'">
				<img src="../images/btn/menu2.png"> <span>견적조회</span>
			</button>
		</li>
		<li class="menu03 btn_menu" value="3">
			<button onclick="location.href='estimate.jsp'">
				<img src="../images/btn/menu3.png"> <span>나의정보</span>
			</button>
		</li>
		<li class="menu04 btn_menu" value="4">
			<button onclick="location.href='statistic.jsp'">
				<img src="../images/btn/menu4.png"> <span>통계관리</span>
			</button>
		</li>
	</ul>
</div>